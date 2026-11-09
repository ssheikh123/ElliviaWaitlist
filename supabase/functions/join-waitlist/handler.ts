/**
 * Runtime-agnostic request handler for the join-waitlist Edge Function.
 * Uses only Web-standard APIs (Request, Response, crypto.subtle) so it can be
 * unit-tested under Node/Vitest and served by Deno in production.
 */
import {
  CONSENT_VERSION,
  isValidEmail,
  isValidName,
  normalizeEmail,
  normalizeName,
  sanitizeReferral,
  type ReferralSource,
  type WaitlistErrorCode,
} from '../_shared/waitlist-rules.ts'
import type { TurnstileOutcome } from './turnstile.ts'

export const MAX_BODY_BYTES = 2048
const MAX_TOKEN_LENGTH = 2048

export interface JoinArgs {
  email: string
  name: string
  referralSource: ReferralSource | null
  consentVersion: string
  clientHash: string
}

export interface HandlerDeps {
  /** Exact origins allowed to call the endpoint, e.g. https://ssheikh123.github.io */
  allowedOrigins: string[]
  /** Accepted values for the `apikey` header. Empty = header not checked. */
  publishableKeys: string[]
  /** HMAC key used to hash client IPs for rate limiting. */
  hashSecret: string
  verifyTurnstile: (token: string, remoteIp: string | null, idempotencyKey: string) => Promise<TurnstileOutcome>
  joinWaitlist: (args: JoinArgs) => Promise<'ok' | 'rate_limited'>
  /** Must never receive personal data. */
  logError?: (event: string, meta?: Record<string, string | number | undefined>) => void
}

export function parseList(value: string | undefined | null): string[] {
  return (value ?? '')
    .split(',')
    .map((s) => s.trim().replace(/\/+$/, ''))
    .filter(Boolean)
}

/** Reads key values out of SUPABASE_PUBLISHABLE_KEYS / SUPABASE_SECRET_KEYS JSON dictionaries. */
export function parseKeyDictionary(json: string | undefined | null): Record<string, string> {
  if (!json) return {}
  try {
    const parsed: unknown = JSON.parse(json)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return Object.fromEntries(
        Object.entries(parsed as Record<string, unknown>).filter((e): e is [string, string] => typeof e[1] === 'string'),
      )
    }
  } catch {
    /* fall through */
  }
  return {}
}

export function getClientIp(req: Request): string | null {
  const h = req.headers
  const direct = h.get('cf-connecting-ip') ?? h.get('x-real-ip')
  if (direct) return direct.trim()
  const fwd = h.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0]!.trim() || null
  return null
}

export async function hmacHex(secret: string, value: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(value))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Constant-time-ish comparison to avoid leaking key prefixes via timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const CAPTCHA_ERRORS: Record<Exclude<TurnstileOutcome, { ok: true }>['reason'], { status: number; error: WaitlistErrorCode }> = {
  missing: { status: 400, error: 'captcha_required' },
  invalid: { status: 400, error: 'captcha_failed' },
  mismatch: { status: 400, error: 'captcha_failed' },
  expired: { status: 400, error: 'captcha_expired' },
  unavailable: { status: 503, error: 'server_error' },
  misconfigured: { status: 500, error: 'server_error' },
}

export function createHandler(deps: HandlerDeps) {
  const allowed = new Set(deps.allowedOrigins)
  const log = deps.logError ?? (() => {})

  function corsHeaders(origin: string | null): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      Vary: 'Origin',
    })
    if (origin && allowed.has(origin)) {
      headers.set('Access-Control-Allow-Origin', origin)
      headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
      headers.set('Access-Control-Allow-Headers', 'content-type, apikey, authorization, x-client-info')
      headers.set('Access-Control-Max-Age', '86400')
    }
    return headers
  }

  function json(origin: string | null, status: number, body: { ok: true } | { ok: false; error: WaitlistErrorCode }) {
    return new Response(JSON.stringify(body), { status, headers: corsHeaders(origin) })
  }
  const fail = (origin: string | null, status: number, error: WaitlistErrorCode) => json(origin, status, { ok: false, error })

  return async function handle(req: Request): Promise<Response> {
    const origin = req.headers.get('origin')
    const originAllowed = origin !== null && allowed.has(origin)

    if (req.method === 'OPTIONS') {
      return new Response(null, { status: originAllowed ? 204 : 403, headers: corsHeaders(origin) })
    }
    if (req.method !== 'POST') return fail(origin, 405, 'method_not_allowed')
    // Browsers always send Origin on cross-origin POSTs; anything else is not our website.
    if (!originAllowed) return fail(origin, 403, 'forbidden_origin')

    if (deps.publishableKeys.length > 0) {
      const apikey = req.headers.get('apikey') ?? ''
      if (!deps.publishableKeys.some((k) => safeEqual(k, apikey))) return fail(origin, 401, 'invalid_request')
    }

    const contentType = req.headers.get('content-type') ?? ''
    if (!contentType.toLowerCase().startsWith('application/json')) return fail(origin, 415, 'invalid_request')

    const declaredLength = Number(req.headers.get('content-length') ?? '0')
    if (declaredLength > MAX_BODY_BYTES) return fail(origin, 413, 'invalid_request')

    let raw: string
    try {
      raw = await req.text()
    } catch {
      return fail(origin, 400, 'invalid_request')
    }
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return fail(origin, 413, 'invalid_request')

    let body: unknown
    try {
      body = JSON.parse(raw)
    } catch {
      return fail(origin, 400, 'invalid_request')
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(origin, 400, 'invalid_request')
    const input = body as Record<string, unknown>

    if (typeof input.name !== 'string') return fail(origin, 400, 'invalid_name')
    const name = normalizeName(input.name)
    if (!isValidName(name)) return fail(origin, 400, 'invalid_name')

    if (typeof input.email !== 'string') return fail(origin, 400, 'invalid_email')
    const email = normalizeEmail(input.email)
    if (!isValidEmail(email)) return fail(origin, 400, 'invalid_email')

    if (input.consent !== true) return fail(origin, 400, 'consent_required')

    const token = input.turnstileToken
    if (typeof token !== 'string' || token.length === 0) return fail(origin, 400, 'captcha_required')
    if (token.length > MAX_TOKEN_LENGTH) return fail(origin, 400, 'captcha_failed')

    // Malformed referral values are dropped rather than failing the signup.
    const referralSource = sanitizeReferral(input.referralSource)

    const ip = getClientIp(req)
    const idempotencyKey = crypto.randomUUID()
    const captcha = await deps.verifyTurnstile(token, ip, idempotencyKey)
    if (!captcha.ok) {
      if (captcha.reason === 'misconfigured' || captcha.reason === 'unavailable') {
        log('turnstile_verification_error', { reason: captcha.reason })
      }
      const mapped = CAPTCHA_ERRORS[captcha.reason]
      return fail(origin, mapped.status, mapped.error)
    }

    try {
      const clientHash = await hmacHex(`ellivia-rate-limit:${deps.hashSecret}`, ip ?? 'unknown')
      const result = await deps.joinWaitlist({ email, name, referralSource, consentVersion: CONSENT_VERSION, clientHash })
      if (result === 'rate_limited') return fail(origin, 429, 'rate_limited')
      // Identical response whether the address was new or already present.
      return json(origin, 200, { ok: true })
    } catch (err) {
      const code = err && typeof err === 'object' && 'code' in err ? String((err as { code: unknown }).code) : 'unknown'
      log('waitlist_insert_failed', { code })
      return fail(origin, 500, 'server_error')
    }
  }
}
