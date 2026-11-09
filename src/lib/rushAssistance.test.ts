import { describe, expect, it } from 'vitest'
import { estimateAssistance, incomeBands, povertyGuideline } from './rushAssistance.ts'

describe('2026 federal poverty guidelines (as published by RUSH / HHS)', () => {
  it.each([
    [1, 15_960],
    [2, 21_640],
    [3, 27_320],
    [4, 33_000],
    [5, 38_680],
    [6, 44_360],
    [8, 55_720],
  ])('household of %i = $%i', (size, amount) => expect(povertyGuideline(size)).toBe(amount))

  it('derives the 300% and 400% bands', () => {
    expect(incomeBands(4)).toEqual({ upTo300: 99_000, upTo400: 132_000 })
  })
})

describe('RUSH assistance estimate for an insured balance', () => {
  it('Charity Care: up to 100% at or below 300% FPG', () => {
    expect(estimateAssistance('up-to-300', 3128)).toMatchObject({ percentOff: 100, youMayPay: 0 })
  })
  it('Underinsured Discount: 80% between 300% and 400% FPG', () => {
    expect(estimateAssistance('300-400', 3128)).toMatchObject({ percentOff: 80, youMayPay: 625.6 })
  })
  it('no income-based discount above 400% FPG', () => {
    expect(estimateAssistance('over-400', 3128)).toMatchObject({ percentOff: 0, program: null, youMayPay: 3128 })
  })
})
