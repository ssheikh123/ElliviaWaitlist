import type { MouseEvent } from 'react'
import { SIGNUP_FIRST_FIELD_ID } from '../components/SignupForm.tsx'

/**
 * Hero call to action: sends visitors to the waitlist form at the bottom of the
 * page and puts the cursor in the first field once they arrive.
 */
export function goToSignup(event?: MouseEvent<HTMLAnchorElement>) {
  const target = document.getElementById('join')
  const field = document.getElementById(SIGNUP_FIRST_FIELD_ID)
  if (!target) return
  event?.preventDefault()
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  window.history.replaceState(null, '', '#join')
  window.setTimeout(() => field?.focus({ preventScroll: true }), reduce ? 0 : 650)
}
