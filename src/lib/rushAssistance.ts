/**
 * Illustrative estimate of RUSH financial assistance for an INSURED patient's
 * balance (deductible + coinsurance), used only by the hero demo.
 *
 * Sources (verified 2026-11-09):
 *  - RUSH Financial Assistance Policy, effective 07/01/2025
 *    (rush.edu/financial-assistance):
 *      • Charity Care Program: reduced by 100% for uninsured or insured patients
 *        with family income ≤ 300% FPG; for insured patients it covers
 *        deductibles and coinsurance only (not copayments). Documentation required.
 *      • Underinsured Discount Program: reduced by 80% for underinsured patients
 *        with family income > 300% and ≤ 400% FPG.
 *      • Catastrophic Balance Program: reduced to a maximum of 20% of household
 *        income over a rolling twelve-month period.
 *  - 2026 Federal Poverty Guidelines (RUSH "Federal Poverty Guidelines 2026-01-15"
 *    and HHS ASPE): $15,960 for 1 person, +$5,680 per additional person.
 *
 * Nothing here is a promise: eligibility requires an application and RUSH decides.
 */

export const FPG_2026_BASE = 15_960
export const FPG_2026_PER_PERSON = 5_680

export function povertyGuideline(householdSize: number): number {
  const n = Math.max(1, Math.floor(householdSize))
  return FPG_2026_BASE + FPG_2026_PER_PERSON * (n - 1)
}

export type IncomeBand = 'up-to-300' | '300-400' | 'over-400'

export interface AssistanceEstimate {
  band: IncomeBand
  /** Percent off the deductible/coinsurance balance, 0–100. */
  percentOff: number
  /** Program name as RUSH calls it, or null when no income-based discount applies. */
  program: string | null
  youMayPay: number
}

export function incomeBands(householdSize: number) {
  const fpg = povertyGuideline(householdSize)
  return { upTo300: fpg * 3, upTo400: fpg * 4 }
}

export function estimateAssistance(band: IncomeBand, balance: number): AssistanceEstimate {
  switch (band) {
    case 'up-to-300':
      return { band, percentOff: 100, program: 'Charity Care Program', youMayPay: 0 }
    case '300-400':
      return {
        band,
        percentOff: 80,
        program: 'Underinsured Discount Program',
        youMayPay: Math.round(balance * 0.2 * 100) / 100,
      }
    case 'over-400':
      return { band, percentOff: 0, program: null, youMayPay: balance }
  }
}

const usd0 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const usd2 = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
export const formatWhole = (n: number) => usd0.format(n)
export const formatCents = (n: number) => usd2.format(n)
