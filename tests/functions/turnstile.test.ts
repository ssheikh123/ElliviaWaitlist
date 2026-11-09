// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { SITEVERIFY_URL, verifyTurnstileToken } from '../../supabase/functions/join-waitlist/turnstile.ts'

const REAL_SECRET = '0x4AAAAAAAREALSECRETEXAMPLE'

function fakeFetch(body: unknown, status = 200) {
  return vi.fn(async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch
}

const base = { secret: REAL_SECRET, token: 'tok', remoteIp: '203.0.113.7', allowedHostnames: ['ssheikh123.github.io'] }

describe('verifyTurnstileToken', () => {
  it('passes a successful verification for our hostname and action', async () => {
    const fetchImpl = fakeFetch({ success: true, hostname: 'ssheikh123.github.io', action: 'join_waitlist' })
    expect(await verifyTurnstileToken({ ...base, fetchImpl, idempotencyKey: 'k1' })).toEqual({ ok: true })

    const [url, init] = vi.mocked(fetchImpl).mock.calls[0]!
    expect(url).toBe(SITEVERIFY_URL)
    const form = (init as RequestInit).body as FormData
    expect(form.get('secret')).toBe(REAL_SECRET)
    expect(form.get('response')).toBe('tok')
    expect(form.get('remoteip')).toBe('203.0.113.7')
    expect(form.get('idempotency_key')).toBe('k1')
  })

  it('maps an invalid token to "invalid"', async () => {
    const fetchImpl = fakeFetch({ success: false, 'error-codes': ['invalid-input-response'] })
    expect(await verifyTurnstileToken({ ...base, fetchImpl })).toEqual({ ok: false, reason: 'invalid' })
  })

  it('maps an expired or already-redeemed token to "expired"', async () => {
    const fetchImpl = fakeFetch({ success: false, 'error-codes': ['timeout-or-duplicate'] })
    expect(await verifyTurnstileToken({ ...base, fetchImpl })).toEqual({ ok: false, reason: 'expired' })
  })

  it('maps a bad secret to "misconfigured"', async () => {
    const fetchImpl = fakeFetch({ success: false, 'error-codes': ['invalid-input-secret'] })
    expect(await verifyTurnstileToken({ ...base, fetchImpl })).toEqual({ ok: false, reason: 'misconfigured' })
    expect(await verifyTurnstileToken({ ...base, secret: '', fetchImpl })).toEqual({ ok: false, reason: 'misconfigured' })
  })

  it('rejects a token issued for a different hostname', async () => {
    const fetchImpl = fakeFetch({ success: true, hostname: 'evil.example', action: 'join_waitlist' })
    expect(await verifyTurnstileToken({ ...base, fetchImpl })).toEqual({ ok: false, reason: 'mismatch' })
  })

  it('rejects a token issued for a different action', async () => {
    const fetchImpl = fakeFetch({ success: true, hostname: 'ssheikh123.github.io', action: 'login' })
    expect(await verifyTurnstileToken({ ...base, fetchImpl })).toEqual({ ok: false, reason: 'mismatch' })
  })

  it('fails closed when Cloudflare is unreachable or errors', async () => {
    const throwing = vi.fn(async () => {
      throw new TypeError('network down')
    }) as unknown as typeof fetch
    expect(await verifyTurnstileToken({ ...base, fetchImpl: throwing })).toEqual({ ok: false, reason: 'unavailable' })
    expect(await verifyTurnstileToken({ ...base, fetchImpl: fakeFetch({}, 502) })).toEqual({ ok: false, reason: 'unavailable' })
  })

  it('never calls Cloudflare without a token', async () => {
    const fetchImpl = fakeFetch({ success: true })
    expect(await verifyTurnstileToken({ ...base, token: '', fetchImpl })).toEqual({ ok: false, reason: 'missing' })
    expect(fetchImpl).not.toHaveBeenCalled()
  })

  it('treats a success with a dummy test secret as valid (hostname not checked)', async () => {
    const fetchImpl = fakeFetch({ success: true, hostname: 'example.com' })
    expect(
      await verifyTurnstileToken({ ...base, secret: '1x0000000000000000000000000000000AA', fetchImpl }),
    ).toEqual({ ok: true })
  })
})

// Live calls to Cloudflare's documented dummy keys. Opt in with TURNSTILE_LIVE=1 (needs network).
describe.runIf(process.env.TURNSTILE_LIVE === '1')('Cloudflare dummy keys (live)', () => {
  const token = 'XXXX.DUMMY.TOKEN.XXXX'
  it('always-pass secret succeeds', async () => {
    expect(
      await verifyTurnstileToken({ ...base, token, secret: '1x0000000000000000000000000000000AA' }),
    ).toEqual({ ok: true })
  })
  it('always-fail secret fails', async () => {
    const r = await verifyTurnstileToken({ ...base, token, secret: '2x0000000000000000000000000000000AA' })
    expect(r.ok).toBe(false)
  })
  it('token-already-spent secret maps to expired', async () => {
    expect(
      await verifyTurnstileToken({ ...base, token, secret: '3x0000000000000000000000000000000AA' }),
    ).toEqual({ ok: false, reason: 'expired' })
  })
})
