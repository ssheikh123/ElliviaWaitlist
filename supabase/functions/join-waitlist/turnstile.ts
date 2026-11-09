/** Server-side Cloudflare Turnstile verification (Siteverify API). */

export const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
export const TURNSTILE_ACTION = 'join_waitlist'

/**
 * Cloudflare's documented dummy secret keys. They only ever produce fixed
 * results, so recognising them can never let a real bot through; we just skip the
 * hostname check because dummy responses don't carry our hostname.
 */
const TEST_SECRETS = new Set([
  '1x0000000000000000000000000000000AA', // always passes
  '2x0000000000000000000000000000000AA', // always fails
  '3x0000000000000000000000000000000AA', // yields "token already spent"
])

export type TurnstileOutcome =
  | { ok: true }
  | { ok: false; reason: 'missing' | 'invalid' | 'expired' | 'mismatch' | 'misconfigured' | 'unavailable' }

interface SiteverifyResponse {
  success: boolean
  'error-codes'?: string[]
  hostname?: string
  action?: string
}

export async function verifyTurnstileToken(options: {
  secret: string
  token: string
  remoteIp: string | null
  allowedHostnames: string[]
  idempotencyKey?: string
  fetchImpl?: typeof fetch
  timeoutMs?: number
}): Promise<TurnstileOutcome> {
  const { secret, token, remoteIp, allowedHostnames, idempotencyKey, fetchImpl = fetch, timeoutMs = 8000 } = options
  if (!secret) return { ok: false, reason: 'misconfigured' }
  if (!token) return { ok: false, reason: 'missing' }

  const form = new FormData()
  form.append('secret', secret)
  form.append('response', token)
  if (remoteIp) form.append('remoteip', remoteIp)
  if (idempotencyKey) form.append('idempotency_key', idempotencyKey)

  let data: SiteverifyResponse
  try {
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(timeoutMs),
    })
    if (!res.ok) return { ok: false, reason: 'unavailable' }
    data = (await res.json()) as SiteverifyResponse
  } catch {
    return { ok: false, reason: 'unavailable' }
  }

  const codes = data['error-codes'] ?? []
  if (!data.success) {
    if (codes.includes('missing-input-secret') || codes.includes('invalid-input-secret')) {
      return { ok: false, reason: 'misconfigured' }
    }
    if (codes.includes('timeout-or-duplicate')) return { ok: false, reason: 'expired' }
    if (codes.includes('missing-input-response')) return { ok: false, reason: 'missing' }
    if (codes.includes('internal-error')) return { ok: false, reason: 'unavailable' }
    return { ok: false, reason: 'invalid' }
  }

  if (!TEST_SECRETS.has(secret)) {
    if (data.action && data.action !== TURNSTILE_ACTION) return { ok: false, reason: 'mismatch' }
    if (allowedHostnames.length > 0 && (!data.hostname || !allowedHostnames.includes(data.hostname))) {
      return { ok: false, reason: 'mismatch' }
    }
  }
  return { ok: true }
}
