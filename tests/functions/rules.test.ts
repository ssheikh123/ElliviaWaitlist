// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { isValidEmail, normalizeEmail, sanitizeReferral } from '../../supabase/functions/_shared/waitlist-rules.ts'

describe('email rules', () => {
  it('normalizes case and whitespace but keeps dots and plus tags', () => {
    expect(normalizeEmail('  Jane.Doe+ER@Example.COM\n')).toBe('jane.doe+er@example.com')
  })

  it.each(['jane@example.com', 'j.doe+waitlist@mail.example.co.uk', 'a1@sub.domain.org', "o'brien@example.ie"])(
    'accepts %s',
    (e) => expect(isValidEmail(normalizeEmail(e))).toBe(true),
  )

  it.each([
    'plainaddress',
    '@example.com',
    'jane@',
    'jane@example',
    'jane@@example.com',
    'jane@exa mple.com',
    '.jane@example.com',
    'jane.@example.com',
    'ja..ne@example.com',
    'jane@-example.com',
    'jane@example.c',
    `${'a'.repeat(65)}@example.com`,
    `jane@${'a'.repeat(250)}.com`,
  ])('rejects %s', (e) => expect(isValidEmail(normalizeEmail(e))).toBe(false))
})

describe('referral rules', () => {
  it('passes known sources through and buckets other slugs', () => {
    expect(sanitizeReferral('instagram')).toBe('instagram')
    expect(sanitizeReferral(' QR-Flyer ')).toBe('qr-flyer')
    expect(sanitizeReferral('facebook')).toBe('other')
  })
  it('drops malformed values', () => {
    for (const v of ['', ' ', 'a b', 'x'.repeat(41), 'drop;table', '-x', 'x-', '🙂', 5, {}, null]) {
      expect(sanitizeReferral(v)).toBeNull()
    }
  })
})
