/**
 * Validation rules shared by the website and the join-waitlist Edge Function.
 * Runtime-agnostic: no Deno, Node, or DOM APIs, so both sides import the exact same logic.
 */

/** Bump this whenever the consent wording on the signup form changes. */
export const CONSENT_VERSION = '2026-11-10-name-email-launch-notify-v3'

export const MAX_EMAIL_LENGTH = 254
export const MAX_NAME_LENGTH = 120

/**
 * Referral sources accepted from `?ref=`. Anything else that is shaped like a slug
 * is recorded as "other"; anything malformed is dropped (null).
 */
export const KNOWN_REFERRALS = [
  'instagram',
  'legal-council',
  'womens-board',
  'qr-flyer',
  'direct',
] as const

export type KnownReferral = (typeof KNOWN_REFERRALS)[number]
export type ReferralSource = KnownReferral | 'other'

const REFERRAL_SLUG = /^[a-z0-9](?:[a-z0-9-]{0,38}[a-z0-9])?$/

/**
 * Pragmatic email check: one @, no whitespace, a dotted domain with a 2+ letter TLD,
 * and RFC length limits. Deliberately conservative so typos are caught, without
 * rejecting legitimate addresses like plus-tags or subdomains.
 */
const EMAIL_PATTERN =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,63}$/

/** Lower-cases and trims. We do not strip dots or +tags: those can be meaningful. */
export function normalizeEmail(raw: string): string {
  return raw.normalize('NFKC').trim().toLowerCase()
}

export function isValidEmail(normalized: string): boolean {
  if (normalized.length < 6 || normalized.length > MAX_EMAIL_LENGTH) return false
  const [local] = normalized.split('@')
  if (!local || local.length > 64) return false
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false
  return EMAIL_PATTERN.test(normalized)
}

/**
 * A person's name (one field, e.g. "Maria O'Brien-López"): letters from any language plus
 * spaces, apostrophes, hyphens and periods. No digits, symbols, or markup.
 */
const NAME_PATTERN = /^[\p{L}\p{M}](?:[\p{L}\p{M}'’ .-]*[\p{L}\p{M}.])?$/u

/** Unicode-normalizes, trims, and collapses inner whitespace. Keeps the person's casing. */
export function normalizeName(raw: string): string {
  return raw.normalize('NFKC').replace(/\s+/g, ' ').trim()
}

export function isValidName(normalized: string): boolean {
  return normalized.length >= 1 && normalized.length <= MAX_NAME_LENGTH && NAME_PATTERN.test(normalized)
}

/** Returns a safe referral value, or null when the input is missing or malformed. */
export function sanitizeReferral(raw: unknown): ReferralSource | null {
  if (typeof raw !== 'string') return null
  const value = raw.trim().toLowerCase()
  if (value.length === 0 || value.length > 40) return null
  if (!REFERRAL_SLUG.test(value)) return null
  return (KNOWN_REFERRALS as readonly string[]).includes(value) ? (value as KnownReferral) : 'other'
}

/** Response contract between the Edge Function and the website. */
export type WaitlistErrorCode =
  | 'invalid_request'
  | 'invalid_email'
  | 'invalid_name'
  | 'consent_required'
  | 'captcha_required'
  | 'captcha_failed'
  | 'captcha_expired'
  | 'rate_limited'
  | 'forbidden_origin'
  | 'method_not_allowed'
  | 'server_error'

export type WaitlistResponse = { ok: true } | { ok: false; error: WaitlistErrorCode }

export interface WaitlistRequestBody {
  name: string
  email: string
  consent: boolean
  turnstileToken: string
  referralSource?: string | null
}
