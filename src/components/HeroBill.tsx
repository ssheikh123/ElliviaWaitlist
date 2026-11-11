import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { ScanLine } from 'lucide-react'
import {
  estimateAssistance,
  formatCents,
  formatWhole,
  incomeBands,
  type IncomeBand,
} from '../lib/rushAssistance.ts'

type Mode = 'before' | 'with'

/** Patient responsibility on the sample bill (deductible + coinsurance, no copay). */
const BALANCE = 3128

const RUSH_FA_URL = 'https://www.rush.edu/patients-visitors/financial-assistance'

/**
 * Hero centerpiece: a SAMPLE ER statement (no real hospital or patient) next to a
 * concept of the Ellivia app. "On its own" shows the full balance; "With Ellivia"
 * shows what RUSH's published financial assistance policy may take off, based on the
 * household size and income range the visitor picks. Nothing picked leaves the page.
 */
export function HeroBill() {
  const [mode, setMode] = useState<Mode>('before')
  const [size, setSize] = useState(4)
  const [band, setBand] = useState<IncomeBand>('300-400')
  const touched = useRef(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setMode('with')
      return
    }
    const t = window.setTimeout(() => {
      if (!touched.current) setMode('with')
    }, 2200)
    return () => window.clearTimeout(t)
  }, [])

  const choose = (m: Mode) => {
    touched.current = true
    setMode(m)
  }
  const explained = mode === 'with'
  const estimate = estimateAssistance(band, BALANCE)
  const saving = explained && estimate.percentOff > 0

  return (
    <figure className="relative mx-auto w-full max-w-[470px] pt-2">
      <div
        role="radiogroup"
        aria-label="Show the sample bill"
        className="relative z-20 mx-auto mb-6 flex w-fit rounded-full bg-paper/80 p-1 shadow-soft ring-1 ring-line backdrop-blur"
      >
        {(
          [
            ['before', 'On its own'],
            ['with', 'With Ellivia'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={mode === value}
            onClick={() => choose(value)}
            className={`rounded-full px-4 py-2 text-[15px] font-semibold transition ${
              mode === value ? 'bg-ink text-white' : 'text-ink hover:bg-azure'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* The paper bill */}
      <div className="relative z-10 -rotate-2 rounded-[6px] bg-paper px-5 pb-5 pt-5 text-ink shadow-paper sm:px-7 sm:pt-6">
        <div className="flex items-start justify-between gap-3 border-b-2 border-dashed border-line pb-4">
          <div>
            <p className="text-[13px] font-semibold text-muted">Emergency Department</p>
            <p className="text-lg font-bold tracking-tight">Patient statement</p>
          </div>
          <span
            aria-hidden="true"
            className="rotate-6 rounded-md border-2 border-[#c0392b]/70 px-2 py-0.5 text-[13px] font-extrabold tracking-wider text-[#a93226]"
          >
            SAMPLE
          </span>
        </div>

        <dl className="mt-3 space-y-2 text-[15px]">
          <Line label="Level 5 ED visit" amount="$3,412.00" />
          <Line label="CT scan" amount="$2,180.00" />
          <Line label="Lab panel" amount="$486.00" />
          <Line label="Insurance" amount="−$2,950.00" />
        </dl>

        <div
          className={`mt-4 rounded-lg px-3 py-3 transition-colors duration-500 ${saving ? 'bg-mint' : 'bg-azure'}`}
          aria-live="polite"
        >
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-ink">{explained ? 'You may pay' : 'Patient responsibility'}</p>
              <p className="text-[13px] text-muted">{explained ? 'With financial assistance' : 'Due in 30 days'}</p>
            </div>
            <div className="text-right">
              {saving && (
                <p className="text-[14px] font-semibold text-muted line-through decoration-2">{formatCents(BALANCE)}</p>
              )}
              <p className="text-[28px] font-extrabold leading-none tracking-tight tabular-nums">
                {formatCents(explained ? estimate.youMayPay : BALANCE)}
              </p>
            </div>
          </div>
          {saving && (
            <p className="mt-2">
              <span className="animate-pop inline-block rounded-full bg-ink px-2.5 py-0.5 text-[13px] font-bold text-white">
                {estimate.percentOff === 100 ? 'Up to 100% off' : `${estimate.percentOff}% off`}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Concept app */}
      <div className="relative z-20 -mt-2 flex items-end justify-center sm:-mt-1 sm:justify-end">
        {explained && (
          <p
            aria-hidden="true"
            className="absolute bottom-40 left-2 hidden w-[150px] -rotate-3 font-hand text-[26px] leading-[1.05] text-ink-2 sm:block"
          >
            Pick your household
            <svg viewBox="0 0 80 30" className="ml-16 mt-1 h-6 w-16 text-ink-2" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M2 6c20 18 46 20 72 10" />
              <path d="M64 8l10 8-12 4" />
            </svg>
          </p>
        )}
        <div className="w-[262px] rotate-2 rounded-[2.3rem] bg-ink p-2 shadow-phone">
          <div className="relative min-h-[300px] overflow-hidden rounded-[1.9rem] bg-azure px-4 pb-5 pt-9">
            <div aria-hidden="true" className="absolute left-1/2 top-2.5 h-4 w-16 -translate-x-1/2 rounded-full bg-ink" />
            {explained ? (
              <HouseholdQuestions size={size} setSize={setSize} band={band} setBand={setBand} />
            ) : (
              <div className="pt-6 text-center">
                <div aria-hidden="true" className="relative mx-auto grid h-36 w-40 place-items-center rounded-xl bg-paper">
                  <ScanLine className="size-9 text-ink-2" strokeWidth={1.5} />
                  <span className="absolute left-2 top-2 size-4 border-l-2 border-t-2 border-ink" />
                  <span className="absolute right-2 top-2 size-4 border-r-2 border-t-2 border-ink" />
                  <span className="absolute bottom-2 left-2 size-4 border-b-2 border-l-2 border-ink" />
                  <span className="absolute bottom-2 right-2 size-4 border-b-2 border-r-2 border-ink" />
                </div>
                <p className="mt-4 text-[14px] font-semibold text-ink">Scan your bill</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <figcaption className="mt-5 text-[13px] leading-relaxed text-muted">
        Sample bill and concept app. Based on{' '}
        <a href={RUSH_FA_URL} className="font-semibold text-link underline underline-offset-2" rel="noopener noreferrer">
          RUSH’s policy
        </a>
        . Covers deductibles and coinsurance, not copays. You must apply, and RUSH decides. Nothing here is saved.
      </figcaption>
    </figure>
  )
}

function HouseholdQuestions({
  size,
  setSize,
  band,
  setBand,
}: {
  size: number
  setSize: (n: number) => void
  band: IncomeBand
  setBand: (b: IncomeBand) => void
}) {
  const uid = useId()
  const { upTo300, upTo400 } = incomeBands(size)
  const bands: { value: IncomeBand; label: string }[] = [
    { value: 'up-to-300', label: `Up to ${formatWhole(upTo300)}` },
    { value: '300-400', label: `${formatWhole(upTo300 + 1)} – ${formatWhole(upTo400)}` },
    { value: 'over-400', label: `Over ${formatWhole(upTo400)}` },
  ]
  const estimate = estimateAssistance(band, BALANCE)

  return (
    <div className="animate-pop text-ink">
      <p className="text-[15px] font-bold">Your household</p>

      <fieldset className="mt-3">
        <legend className="text-[12px] font-semibold text-muted">People at home</legend>
        <div className="mt-1.5 grid grid-cols-6 gap-1">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <label key={n} className="relative">
              <input
                type="radio"
                name={`${uid}-size`}
                value={n}
                checked={size === n}
                onChange={() => setSize(n)}
                aria-label={`${n} ${n === 1 ? 'person' : 'people'}`}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className="grid h-8 cursor-pointer place-items-center rounded-lg bg-paper text-[14px] font-semibold ring-1 ring-line peer-checked:bg-ink peer-checked:text-white peer-checked:ring-ink peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink"
              >
                {n}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-3">
        <legend className="text-[12px] font-semibold text-muted">Yearly income</legend>
        <div className="mt-1.5 space-y-1">
          {bands.map((b) => (
            <label key={b.value} className="relative block">
              <input
                type="radio"
                name={`${uid}-income`}
                value={b.value}
                checked={band === b.value}
                onChange={() => setBand(b.value)}
                className="peer sr-only"
              />
              <span className="block cursor-pointer rounded-lg bg-paper px-3 py-1.5 text-[13px] font-semibold tabular-nums ring-1 ring-line peer-checked:bg-mint-2 peer-checked:ring-ink/40 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {b.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-3 rounded-xl bg-paper px-3 py-2.5 ring-1 ring-line" aria-live="polite">
        {estimate.percentOff > 0 ? (
          <>
            <p className="text-[12px] font-semibold text-muted">You may qualify for</p>
            <p className="text-[22px] font-extrabold leading-tight">
              {estimate.percentOff === 100 ? 'Up to 100% off' : '80% off'}
            </p>
            <p className="text-[12px] text-copy">RUSH {estimate.program}</p>
          </>
        ) : (
          <p className="text-[13px] font-semibold leading-snug text-ink">No income-based discount at this income</p>
        )}
      </div>
    </div>
  )
}

function Line({ label, amount }: { label: ReactNode; amount: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="min-w-0 text-copy">{label}</dt>
      <dd className="shrink-0 font-semibold tabular-nums">{amount}</dd>
    </div>
  )
}
