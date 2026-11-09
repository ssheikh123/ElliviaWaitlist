import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { ScanLine } from 'lucide-react'

type Mode = 'before' | 'with'

/**
 * The hero's centerpiece: a SAMPLE emergency-room statement (no real hospital,
 * no real patient) that visitors can flip between "confusing" and "explained".
 * One orchestrated moment: the notes stick on once, shortly after load, unless
 * the visitor has reduced motion turned on (then they start explained).
 */
export function HeroBill() {
  const [mode, setMode] = useState<Mode>('before')
  const touched = useRef(false)

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
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

  return (
    <figure className="relative mx-auto w-full max-w-[460px] pt-2 sm:pb-44">
      {/* Switch */}
      <div
        role="radiogroup"
        aria-label="Show the sample bill"
        className="relative z-20 mx-auto mb-6 flex w-fit rounded-full sm:mb-12 sm:mr-0 bg-paper/80 p-1 shadow-soft ring-1 ring-line backdrop-blur"
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

      <div className="relative">
      {/* The paper */}
      <div className="relative z-10 -rotate-2 rounded-[6px] bg-paper px-5 pb-6 pt-5 text-ink shadow-paper sm:px-7 sm:pt-6">
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

        <dl className="mt-3 space-y-2.5 text-[14px] sm:text-[15px]">
          <Line label={<Jargon on={!explained}>Level 5 ED visit, CPT 99285</Jargon>} amount="$3,412.00" />
          <Line label="CT, head without contrast" amount="$2,180.00" />
          <Line label={<Jargon on={!explained}>Lab panel, rev. code 0300</Jargon>} amount="$486.00" />
          <Line label={<Jargon on={!explained}>Contractual adjustment</Jargon>} amount="−$2,950.00" />
        </dl>

        <div className="mt-4 flex items-end justify-between rounded-lg bg-azure px-3 py-3">
          <div>
            <p className="text-[13px] font-semibold text-muted">
              <Jargon on={!explained}>Patient responsibility</Jargon>
            </p>
            <p className="text-[13px] text-muted">Due in 30 days</p>
          </div>
          <p className="relative text-[28px] font-extrabold leading-none tracking-tight">
            <span
              aria-hidden="true"
              className={`absolute -inset-x-1.5 bottom-0.5 h-3 -skew-x-6 rounded-sm bg-mint-2 transition-opacity duration-500 ${
                explained ? 'opacity-100' : 'opacity-0'
              }`}
            />
            <span className="relative">$3,128.00</span>
          </p>
        </div>

      </div>

      {/* Concept phone peeking in */}
      <div
        aria-hidden="true"
        className="absolute -bottom-[150px] right-0 z-20 w-[104px] rotate-[7deg] sm:-bottom-[168px] sm:-right-3 rounded-[1.6rem] bg-ink p-[5px] shadow-phone sm:w-[124px]"
      >
        <div className="relative overflow-hidden rounded-[1.3rem] bg-azure px-2.5 pb-3 pt-6">
          <div className="absolute left-1/2 top-1.5 h-3 w-10 -translate-x-1/2 rounded-full bg-ink" />
          <div className="relative grid h-[92px] place-items-center rounded-lg bg-paper">
            <ScanLine className="size-7 text-ink-2" strokeWidth={1.5} />
            <span className="absolute left-1 top-1 size-3 border-l-2 border-t-2 border-ink" />
            <span className="absolute right-1 top-1 size-3 border-r-2 border-t-2 border-ink" />
            <span className="absolute bottom-1 left-1 size-3 border-b-2 border-l-2 border-ink" />
            <span className="absolute bottom-1 right-1 size-3 border-b-2 border-r-2 border-ink" />
          </div>
          <p className="mt-2 text-center text-[10px] font-semibold text-ink">
            {explained ? 'Bill scanned' : 'Hold steady…'}
          </p>
        </div>
      </div>

      </div>

      {/* Sticky notes (only in "With Ellivia"): stacked under the bill on phones, pinned around it on larger screens */}
      <div className="mt-8 flex min-h-[236px] flex-col items-start gap-3 pr-28 sm:mt-0 sm:block sm:min-h-0 sm:pr-0">
        {explained && (
          <>
            <Note tilt="-4deg" className="bg-mint sm:absolute sm:-left-2 sm:top-0" delay="0ms">
              1. Scan your bill with your phone
            </Note>
            <Note tilt="3deg" className="bg-baby sm:absolute sm:bottom-[84px] sm:left-0" delay="140ms">
              2. Answer a few questions about your household
            </Note>
            <Note tilt="-2deg" className="bg-mint sm:absolute sm:bottom-[76px] sm:left-[180px]" delay="280ms">
              3. See where and how to apply for help
            </Note>
          </>
        )}
      </div>

      <figcaption className="sr-only">
        {explained
          ? 'A sample hospital bill with Ellivia’s three steps attached as notes.'
          : 'A sample hospital bill full of billing codes and jargon.'}
      </figcaption>
      <p className="relative z-20 mt-4 text-[13px] text-muted sm:absolute sm:inset-x-0 sm:bottom-0 sm:mt-0 sm:pr-32">
        Sample bill and concept app. Not real patient data or final app screens.
      </p>
    </figure>
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

function Jargon({ on, children }: { on: boolean; children: ReactNode }) {
  return (
    <span
      className={`decoration-2 underline-offset-4 transition ${
        on ? 'underline decoration-[#c0392b]/60 decoration-wavy' : 'no-underline'
      }`}
    >
      {children}
      {on && (
        <span aria-hidden="true" className="ml-1 inline-grid size-4 place-items-center rounded-full bg-[#c0392b]/12 align-middle text-[11px] font-bold text-[#a93226]">
          ?
        </span>
      )}
    </span>
  )
}

function Note({
  children,
  className,
  tilt,
  delay,
}: {
  children: ReactNode
  className: string
  tilt: string
  delay: string
}) {
  return (
    <p
      style={{ '--tilt': tilt, animationDelay: delay, transform: `rotate(${tilt})` } as CSSProperties}
      className={`relative z-30 w-[200px] animate-stick rounded-[3px] px-3 pb-3 pt-4 font-hand text-[21px] leading-[1.05] text-ink shadow-soft sm:w-[172px] ${className}`}
    >
      <span aria-hidden="true" className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-2 bg-paper/70 shadow-sm" />
      {children}
    </p>
  )
}
