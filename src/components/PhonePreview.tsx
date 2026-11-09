import { ChevronRight, ListChecks, ScanLine, Signpost } from 'lucide-react'
import { LogoMark } from './Logo.tsx'

/**
 * An illustrative, CSS-only phone. It shows the three planned steps; it is NOT a
 * screenshot of the real app, and is labelled as a concept.
 */
export function PhonePreview() {
  return (
    <figure className="relative mx-auto w-full max-w-[300px] animate-rise [animation-delay:120ms] sm:max-w-[320px]">
      <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,#dbe8fb,transparent)]" />
      <div
        aria-hidden="true"
        className="relative rounded-[3.1rem] bg-navy-950 p-[11px] shadow-phone ring-1 ring-white/10"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ice">
          <div className="absolute left-1/2 top-2.5 z-10 h-[26px] w-[92px] -translate-x-1/2 rounded-full bg-navy-950" />
          <div className="flex items-center justify-between px-7 pt-3.5 text-[11px] font-semibold text-ink">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-4 rounded-[3px] border border-ink/70" />
            </span>
          </div>

          <div className="px-4 pb-6 pt-8">
            <div className="flex items-center gap-2">
              <LogoMark className="size-6 text-navy-900" />
              <span className="text-[15px] font-semibold tracking-tight text-navy-900">Ellivia</span>
            </div>
            <p className="mt-4 text-[19px] font-semibold leading-tight tracking-tight text-navy-900">
              Let’s look at your options.
            </p>

            <div className="mt-4 rounded-2xl bg-white p-3.5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent-600">
                  <ScanLine className="size-[18px]" />
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-ink">Scan your bill</p>
                  <p className="text-[11px] text-slate-soft">Use your camera</p>
                </div>
                <span className="grid size-5 place-items-center rounded-full bg-success text-[10px] text-white">✓</span>
              </div>
              <div className="mt-3 grid h-16 place-items-center rounded-xl border border-dashed border-[#c5d5ec] bg-ice">
                <div className="w-3/4 space-y-1.5">
                  <div className="h-1.5 w-full rounded bg-[#d6e2f3]" />
                  <div className="h-1.5 w-2/3 rounded bg-[#d6e2f3]" />
                  <div className="h-1.5 w-5/6 rounded bg-[#d6e2f3]" />
                </div>
              </div>
            </div>

            <div className="mt-3 rounded-2xl bg-white p-3.5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-accent-600">
                  <ListChecks className="size-[18px]" />
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-ink">A few questions</p>
                  <p className="text-[11px] text-slate-soft">Household, income, insurance</p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist">
                <div className="h-full w-2/3 rounded-full bg-accent" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-navy-900 p-3.5 text-white shadow-soft">
              <span className="grid size-9 place-items-center rounded-xl bg-white/10">
                <Signpost className="size-[18px]" />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold">Your next steps</p>
                <p className="text-[11px] text-white/70">Where and how to apply</p>
              </div>
              <ChevronRight className="size-4 text-white/70" />
            </div>

            <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-ink/80" />
          </div>
        </div>
      </div>
      <figcaption className="mt-5 text-center text-xs text-slate-soft">
        Concept illustration. Not a screenshot of the final app.
      </figcaption>
    </figure>
  )
}
