import { config } from '../config.ts'
import type {
  WaitlistErrorCode,
  WaitlistRequestBody,
  WaitlistResponse,
} from '../../supabase/functions/_shared/waitlist-rules.ts'

export type SubmitResult = { ok: true } | { ok: false; error: WaitlistErrorCode | 'network_error' }

const KNOWN_ERRORS: ReadonlySet<string> = new Set<WaitlistErrorCode>([
  'invalid_request',
  'invalid_email',
  'invalid_name',
  'consent_required',
  'captcha_required',
  'captcha_failed',
  'captcha_expired',
  'rate_limited',
  'forbidden_origin',
  'method_not_allowed',
  'server_error',
])

export async function submitWaitlist(body: WaitlistRequestBody, signal?: AbortSignal): Promise<SubmitResult> {
  let response: Response
  try {
    response = await fetch(config.functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // New-style keys go on the apikey header only (never Authorization: Bearer).
        apikey: config.publishableKey,
      },
      body: JSON.stringify(body),
      signal,
      credentials: 'omit',
      cache: 'no-store',
    })
  } catch {
    return { ok: false, error: 'network_error' }
  }

  let data: Partial<WaitlistResponse> & { error?: string } = {}
  try {
    data = await response.json()
  } catch {
    /* non-JSON (e.g. gateway error page) */
  }

  if (response.ok && data.ok === true) return { ok: true }
  const code = typeof data.error === 'string' && KNOWN_ERRORS.has(data.error) ? (data.error as WaitlistErrorCode) : null
  if (code) return { ok: false, error: code }
  if (response.status === 429) return { ok: false, error: 'rate_limited' }
  return { ok: false, error: 'server_error' }
}

// The text shown for each error code lives in src/i18n/strings.ts (form.errors), in English and Spanish.
