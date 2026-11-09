import { beforeEach, describe, expect, it } from 'vitest'
import { __resetReferralForTests, captureReferral, getStoredReferral } from './referral.ts'

beforeEach(() => __resetReferralForTests())

describe('referral tracking', () => {
  it.each(['instagram', 'legal-council', 'womens-board', 'qr-flyer', 'direct'])('captures ?ref=%s', (ref) => {
    expect(captureReferral(`?ref=${ref}`)).toBe(ref)
    expect(getStoredReferral()).toBe(ref)
  })

  it('keeps the first source for the session (first touch wins)', () => {
    captureReferral('?ref=qr-flyer')
    captureReferral('?ref=instagram')
    captureReferral('')
    expect(getStoredReferral()).toBe('qr-flyer')
  })

  it('buckets unknown slugs and ignores malformed values', () => {
    expect(captureReferral('?ref=tiktok')).toBe('other')
    __resetReferralForTests()
    expect(captureReferral('?ref=%3Cscript%3E')).toBeNull()
    expect(captureReferral('?ref=')).toBeNull()
    expect(getStoredReferral()).toBeNull()
  })

  it('ignores tampered session storage values', () => {
    window.sessionStorage.setItem('ellivia.ref', '<img onerror=alert(1)>')
    expect(getStoredReferral()).toBeNull()
  })
})
