import { sanitizeReferral, type ReferralSource } from '../../supabase/functions/_shared/waitlist-rules.ts'

const STORAGE_KEY = 'ellivia.ref'
let memoryRef: ReferralSource | null | undefined

/**
 * First-touch referral attribution for the current browser session.
 * The first valid ?ref= value seen is kept; later navigation (anchors, a second
 * ?ref= in the same tab) never overwrites it. Only sessionStorage is used; nothing
 * is sent anywhere until the visitor chooses to submit the form.
 */
export function captureReferral(search: string = window.location.search): ReferralSource | null {
  const existing = getStoredReferral()
  if (existing) return existing

  const fromUrl = sanitizeReferral(new URLSearchParams(search).get('ref'))
  if (fromUrl) {
    memoryRef = fromUrl
    try {
      window.sessionStorage.setItem(STORAGE_KEY, fromUrl)
    } catch {
      /* storage unavailable (private mode, blocked): memory fallback is enough */
    }
  }
  return fromUrl
}

export function getStoredReferral(): ReferralSource | null {
  if (memoryRef) return memoryRef
  try {
    const stored = sanitizeReferral(window.sessionStorage.getItem(STORAGE_KEY))
    if (stored) memoryRef = stored
    return stored
  } catch {
    return null
  }
}

/** Test helper. */
export function __resetReferralForTests() {
  memoryRef = undefined
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}
