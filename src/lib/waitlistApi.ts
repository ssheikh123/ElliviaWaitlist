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

export const ERROR_MESSAGES: Record<WaitlistErrorCode | 'network_error', string> = {
  invalid_request: 'Something about that request didn’t look right. Please refresh the page and try again.',
  invalid_email: 'Please enter a valid email address, like name@example.com.',
  invalid_name: 'Please enter your first and last name using letters only.',
  consent_required: 'Please check the box to confirm you’d like launch updates.',
  captcha_required: 'Please complete the quick security check below.',
  captcha_failed: 'The security check didn’t go through. Please try it again.',
  captcha_expired: 'The security check expired. Please complete it again.',
  rate_limited: 'Too many attempts from this connection. Please wait a few minutes and try again.',
  forbidden_origin: 'This form can only be submitted from the official Ellivia website.',
  method_not_allowed: 'Something went wrong. Please refresh the page and try again.',
  server_error: 'We couldn’t save your signup just now. Please try again in a moment.',
  network_error: 'We couldn’t reach our server. Check your connection and try again.',
}
