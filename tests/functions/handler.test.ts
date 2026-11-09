// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { createHandler, getClientIp, parseKeyDictionary, type HandlerDeps } from '../../supabase/functions/join-waitlist/handler.ts'
import { CONSENT_VERSION } from '../../supabase/functions/_shared/waitlist-rules.ts'

const ORIGIN = 'https://ssheikh123.github.io'
const KEY = 'sb_publishable_test_key'

function setup(overrides: Partial<HandlerDeps> = {}) {
  const deps: HandlerDeps = {
    allowedOrigins: [ORIGIN],
    publishableKeys: [KEY],
    hashSecret: 'test-secret',
    verifyTurnstile: vi.fn(async () => ({ ok: true as const })),
    joinWaitlist: vi.fn(async () => 'ok' as const),
    logError: vi.fn(),
    ...overrides,
  }
  return { deps, handle: createHandler(deps) }
}

function post(body: unknown, init: { origin?: string | null; apikey?: string | null; headers?: Record<string, string> } = {}) {
  const headers: Record<string, string> = { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.7', ...init.headers }
  if (init.origin !== null) headers.origin = init.origin ?? ORIGIN
  if (init.apikey !== null) headers.apikey = init.apikey ?? KEY
  return new Request('https://example.supabase.co/functions/v1/join-waitlist', {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
}

const valid = {
  name: "  Jane   O'Brien-López ",
  email: '  Jane.Doe+ER@Example.COM ',
  consent: true,
  turnstileToken: 'tok',
  referralSource: 'instagram',
}

describe('join-waitlist handler', () => {
  it('accepts a valid signup, normalizes the email and forwards the referral', async () => {
    const { deps, handle } = setup()
    const res = await handle(post(valid))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(res.headers.get('access-control-allow-origin')).toBe(ORIGIN)
    expect(deps.joinWaitlist).toHaveBeenCalledWith({
      email: 'jane.doe+er@example.com',
      name: "Jane O'Brien-López",
      referralSource: 'instagram',
      consentVersion: CONSENT_VERSION,
      clientHash: expect.stringMatching(/^[a-f0-9]{64}$/),
    })
    expect(deps.verifyTurnstile).toHaveBeenCalledWith('tok', '203.0.113.7', expect.any(String))
  })

  it('never stores the raw IP: the client hash is a keyed HMAC', async () => {
    const { deps, handle } = setup()
    await handle(post(valid))
    const { clientHash } = vi.mocked(deps.joinWaitlist).mock.calls[0]![0]
    expect(clientHash).not.toContain('203.0.113.7')
    // Same IP + same secret = same hash (so rate limiting works); different secret = different hash.
    const { deps: deps2, handle: handle2 } = setup({ hashSecret: 'other' })
    await handle2(post(valid))
    expect(vi.mocked(deps2.joinWaitlist).mock.calls[0]![0].clientHash).not.toBe(clientHash)
  })

  it.each([
    ['not-an-email'],
    ['missing@tld'],
    ['two@@example.com'],
    ['spaces in@example.com'],
    [''],
    [`${'a'.repeat(250)}@example.com`],
  ])('rejects invalid email %j', async (email) => {
    const { deps, handle } = setup()
    const res = await handle(post({ ...valid, email }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ ok: false, error: 'invalid_email' })
    expect(deps.verifyTurnstile).not.toHaveBeenCalled()
    expect(deps.joinWaitlist).not.toHaveBeenCalled()
  })

  it.each([
    [{ name: '' }],
    [{ name: '   ' }],
    [{ name: undefined }],
    [{ name: 42 }],
    [{ name: '<script>' }],
    [{ name: 'R2-D2' }],
    [{ name: 'a@b.co' }],
    [{ name: 'x'.repeat(121) }],
  ])('rejects missing or invalid names %j before any captcha or database work', async (patch) => {
    const { deps, handle } = setup()
    const res = await handle(post({ ...valid, ...patch }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ ok: false, error: 'invalid_name' })
    expect(deps.verifyTurnstile).not.toHaveBeenCalled()
    expect(deps.joinWaitlist).not.toHaveBeenCalled()
  })

  it.each([['José Ramírez'], ['Nguyễn Văn An'], ['Mary Jane Watson'], ['John St. John'], ['李明'], ['Cher']])('accepts the name %s', async (name) => {
    const { deps, handle } = setup()
    expect((await handle(post({ ...valid, name }))).status).toBe(200)
    expect(vi.mocked(deps.joinWaitlist).mock.calls[0]![0].name).toBe(name)
  })

  it('rejects a non-string email', async () => {
    const { handle } = setup()
    const res = await handle(post({ ...valid, email: ['a@b.co'] }))
    expect(await res.json()).toEqual({ ok: false, error: 'invalid_email' })
  })

  it.each([[false], ['true'], [undefined], [1]])('requires explicit consent === true (got %j)', async (consent) => {
    const { deps, handle } = setup()
    const res = await handle(post({ ...valid, consent }))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ ok: false, error: 'consent_required' })
    expect(deps.joinWaitlist).not.toHaveBeenCalled()
  })

  it('rejects a missing Turnstile token without calling Cloudflare', async () => {
    const { deps, handle } = setup()
    const res = await handle(post({ ...valid, turnstileToken: '' }))
    expect(await res.json()).toEqual({ ok: false, error: 'captcha_required' })
    expect(deps.verifyTurnstile).not.toHaveBeenCalled()
  })

  it('rejects an invalid Turnstile token', async () => {
    const { deps, handle } = setup({ verifyTurnstile: vi.fn(async () => ({ ok: false as const, reason: 'invalid' as const })) })
    const res = await handle(post(valid))
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ ok: false, error: 'captcha_failed' })
    expect(deps.joinWaitlist).not.toHaveBeenCalled()
  })

  it('reports an expired / already-used Turnstile token distinctly', async () => {
    const { handle } = setup({ verifyTurnstile: vi.fn(async () => ({ ok: false as const, reason: 'expired' as const })) })
    const res = await handle(post(valid))
    expect(await res.json()).toEqual({ ok: false, error: 'captcha_expired' })
  })

  it('treats a hostname/action mismatch as a failed check', async () => {
    const { handle } = setup({ verifyTurnstile: vi.fn(async () => ({ ok: false as const, reason: 'mismatch' as const })) })
    expect(await (await handle(post(valid))).json()).toEqual({ ok: false, error: 'captcha_failed' })
  })

  it('fails closed with a generic error when Turnstile is misconfigured or unreachable', async () => {
    for (const reason of ['misconfigured', 'unavailable'] as const) {
      const { deps, handle } = setup({ verifyTurnstile: vi.fn(async () => ({ ok: false as const, reason })) })
      const res = await handle(post(valid))
      expect(res.status).toBeGreaterThanOrEqual(500)
      expect(await res.json()).toEqual({ ok: false, error: 'server_error' })
      expect(deps.joinWaitlist).not.toHaveBeenCalled()
      expect(deps.logError).toHaveBeenCalledWith('turnstile_verification_error', { reason })
    }
  })

  it('returns the same response for a duplicate email (no account enumeration)', async () => {
    // The database function reports 'ok' for both new and existing addresses.
    const { handle } = setup()
    const first = await handle(post(valid))
    const second = await handle(post({ ...valid, email: 'JANE.DOE+er@example.com' }))
    expect(first.status).toBe(second.status)
    expect(await first.json()).toEqual(await second.json())
  })

  it('returns 429 when the database rate limit trips', async () => {
    const { handle } = setup({ joinWaitlist: vi.fn(async () => 'rate_limited' as const) })
    const res = await handle(post(valid))
    expect(res.status).toBe(429)
    expect(await res.json()).toEqual({ ok: false, error: 'rate_limited' })
  })

  it('returns a generic 500 on database errors and logs no personal data', async () => {
    const logError = vi.fn()
    const { handle } = setup({
      logError,
      joinWaitlist: vi.fn(async () => {
        throw { code: '23514', message: 'violates check constraint, Failing row contains (jane.doe+er@example.com)' }
      }),
    })
    const res = await handle(post(valid))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ ok: false, error: 'server_error' })
    expect(logError).toHaveBeenCalledWith('waitlist_insert_failed', { code: '23514' })
    expect(JSON.stringify(logError.mock.calls)).not.toMatch(/example\.com|203\.0\.113|tok|Jane|Brien/)
  })

  describe('referral validation', () => {
    it.each([
      ['instagram', 'instagram'],
      ['LEGAL-COUNCIL', 'legal-council'],
      ['womens-board', 'womens-board'],
      ['qr-flyer', 'qr-flyer'],
      ['direct', 'direct'],
      ['newsletter', 'other'],
      ['<script>alert(1)</script>', null],
      ['a'.repeat(41), null],
      ['-leading', null],
      ['has space', null],
      [42, null],
      [null, null],
      [undefined, null],
    ])('%j is stored as %j and never blocks the signup', async (referralSource, expected) => {
      const { deps, handle } = setup()
      const res = await handle(post({ ...valid, referralSource }))
      expect(res.status).toBe(200)
      expect(vi.mocked(deps.joinWaitlist).mock.calls[0]![0].referralSource).toBe(expected)
    })
  })

  describe('CORS and origin restrictions', () => {
    it('answers an allowed preflight', async () => {
      const { handle } = setup()
      const res = await handle(
        new Request('https://x/functions/v1/join-waitlist', {
          method: 'OPTIONS',
          headers: { origin: ORIGIN, 'access-control-request-method': 'POST' },
        }),
      )
      expect(res.status).toBe(204)
      expect(res.headers.get('access-control-allow-origin')).toBe(ORIGIN)
      expect(res.headers.get('access-control-allow-headers')).toContain('apikey')
      expect(res.headers.get('access-control-allow-methods')).toBe('POST, OPTIONS')
    })

    it('refuses a preflight from another origin without CORS headers', async () => {
      const { handle } = setup()
      const res = await handle(
        new Request('https://x/functions/v1/join-waitlist', { method: 'OPTIONS', headers: { origin: 'https://evil.example' } }),
      )
      expect(res.status).toBe(403)
      expect(res.headers.get('access-control-allow-origin')).toBeNull()
    })

    it.each([['https://evil.example'], ['http://ssheikh123.github.io'], ['https://ssheikh123.github.io.evil.example'], ['null']])(
      'rejects POST from origin %s',
      async (origin) => {
        const { deps, handle } = setup()
        const res = await handle(post(valid, { origin }))
        expect(res.status).toBe(403)
        expect(await res.json()).toEqual({ ok: false, error: 'forbidden_origin' })
        expect(res.headers.get('access-control-allow-origin')).toBeNull()
        expect(deps.verifyTurnstile).not.toHaveBeenCalled()
      },
    )

    it('rejects POST with no Origin header (non-browser clients)', async () => {
      const { handle } = setup()
      const res = await handle(post(valid, { origin: null }))
      expect(res.status).toBe(403)
    })

    it('does not allow localhost unless explicitly configured', async () => {
      const { handle } = setup()
      expect((await handle(post(valid, { origin: 'http://localhost:5173' }))).status).toBe(403)
      const { handle: devHandle } = setup({ allowedOrigins: [ORIGIN, 'http://localhost:5173'] })
      expect((await devHandle(post(valid, { origin: 'http://localhost:5173' }))).status).toBe(200)
    })
  })

  describe('request hygiene', () => {
    it('rejects a missing or wrong publishable key', async () => {
      const { handle } = setup()
      expect((await handle(post(valid, { apikey: null }))).status).toBe(401)
      expect((await handle(post(valid, { apikey: 'sb_publishable_wrong' }))).status).toBe(401)
    })

    it('rejects non-POST methods', async () => {
      const { handle } = setup()
      const res = await handle(new Request('https://x/', { method: 'GET', headers: { origin: ORIGIN } }))
      expect(res.status).toBe(405)
    })

    it('rejects non-JSON content types', async () => {
      const { handle } = setup()
      const res = await handle(post('email=a@b.co', { headers: { 'content-type': 'application/x-www-form-urlencoded' } }))
      expect(res.status).toBe(415)
    })

    it('rejects malformed JSON and non-object bodies', async () => {
      const { handle } = setup()
      expect((await handle(post('{not json'))).status).toBe(400)
      expect((await handle(post('[1,2]'))).status).toBe(400)
      expect((await handle(post('null'))).status).toBe(400)
    })

    it('rejects oversized bodies', async () => {
      const { handle } = setup()
      const res = await handle(post({ ...valid, padding: 'x'.repeat(5000) }))
      expect(res.status).toBe(413)
    })

    it('sets no-store and nosniff headers', async () => {
      const { handle } = setup()
      const res = await handle(post(valid))
      expect(res.headers.get('cache-control')).toBe('no-store')
      expect(res.headers.get('x-content-type-options')).toBe('nosniff')
    })
  })
})

describe('helpers', () => {
  it('parses Supabase key dictionaries safely', () => {
    expect(parseKeyDictionary('{"default":"sb_secret_x","other":3}')).toEqual({ default: 'sb_secret_x' })
    expect(parseKeyDictionary('not json')).toEqual({})
    expect(parseKeyDictionary(undefined)).toEqual({})
    expect(parseKeyDictionary('["a"]')).toEqual({})
  })

  it('prefers Cloudflare connecting IP over forwarded headers', () => {
    const req = new Request('https://x/', { headers: { 'x-forwarded-for': '1.1.1.1, 2.2.2.2', 'cf-connecting-ip': '9.9.9.9' } })
    expect(getClientIp(req)).toBe('9.9.9.9')
    expect(getClientIp(new Request('https://x/', { headers: { 'x-forwarded-for': '1.1.1.1, 2.2.2.2' } }))).toBe('1.1.1.1')
    expect(getClientIp(new Request('https://x/'))).toBeNull()
  })
})
