import type { ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  BellRing,
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  CircleCheck,
  CircleHelp,
  FileText,
  Gavel,
  ListChecks,
  ScanLine,
  ShieldCheck,
  Signpost,
  X,
  type LucideIcon,
} from 'lucide-react'
import { SignupForm } from './SignupForm.tsx'
import { goToSignup } from '../lib/goToSignup.ts'
import { LaunchPill } from './Nav.tsx'
import { HeroBill } from './HeroBill.tsx'
import { privacyHref } from '../config.ts'

/* ------------------------------------------------------------------ Hero */

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="sky-grid relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 size-[520px] rounded-full bg-baby/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 size-[420px] rounded-full bg-mint/70 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-start gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-24 lg:pt-20">
        <div className="lg:pt-24">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-mint px-3.5 py-1.5 text-[14px] font-semibold text-ink ring-1 ring-ink/10">
              <span aria-hidden="true" className="size-2 rounded-full bg-success" />
              Launching this December
            </p>
            {/* the nav hides this label on phones, so show it here instead */}
            <LaunchPill className="inline-flex py-1.5 text-[13px] sm:hidden" />
          </div>
          <h1 id="hero-title" className="mt-6 text-ink [font-variation-settings:'wdth'_90]">
            <span className="block max-w-[12ch] text-balance text-[44px] font-extrabold leading-[0.98] tracking-[-0.035em] sm:text-[64px] lg:text-[72px]">
              Medical bills are stressful.
            </span>{' '}
            <span className="mt-3 block text-[28px] font-bold leading-[1.1] tracking-[-0.025em] text-ink-2 sm:text-[38px] lg:text-[42px]">
              Finding help shouldn’t be.
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-copy sm:text-xl">
            Find hospital financial assistance you may qualify for, and how to apply.
          </p>

          <JoinCta />
        </div>
        <HeroBill />
      </div>
    </section>
  )
}

function JoinCta() {
  return (
    <div className="mt-9">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <a
          href="#join"
          onClick={goToSignup}
          className="group inline-flex h-16 items-center gap-4 rounded-full bg-mint-2 pl-7 pr-2 text-[19px] font-bold text-ink shadow-paper ring-1 ring-ink/10 transition hover:bg-mint-3 active:scale-[0.98]"
        >
          Save my free spot
          <span className="grid size-12 place-items-center rounded-full bg-ink text-white transition group-hover:translate-y-0.5">
            <ArrowDown className="size-5" aria-hidden="true" />
          </span>
        </a>
        <p className="-rotate-2 font-hand text-[25px] leading-none text-ink-2">It takes less than a minute!</p>
      </div>
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-copy">
        {['Free to download and use', 'Just your name and email', 'No medical info needed'].map((t) => (
          <li key={t} className="flex items-center gap-1.5">
            <BadgeCheck className="size-4 text-success" aria-hidden="true" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------- How it works */

const steps: { icon: LucideIcon; title: string; body: string; tint: string }[] = [
  { icon: ScanLine, title: 'Scan Your Bill', body: 'Start by scanning your hospital bill with your phone.', tint: 'bg-mint' },
  {
    icon: ListChecks,
    title: 'Explore Financial Assistance',
    body: 'Answer a few questions to discover assistance programs that may apply to you.',
    tint: 'bg-baby',
  },
  {
    icon: Signpost,
    title: 'Understand Your Next Steps',
    body: 'Learn where and how to apply for available assistance.',
    tint: 'bg-mint',
  },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" id="how-it-works" className="bg-paper px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 id="how-title" className="max-w-[18ch] text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
          From a confusing bill to a clear next step.
        </h2>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* the route connecting the stops */}
          <span aria-hidden="true" className="absolute bottom-8 left-[26px] top-8 border-l-[3px] border-dotted border-ink/30 md:bottom-auto md:left-[4%] md:right-[30%] md:top-[26px] md:border-l-0 md:border-t-[3px]" />
          {steps.map(({ icon: Icon, title, body, tint }, i) => (
            <li key={title} className="relative flex gap-5 md:block">
              <span className={`relative grid size-14 shrink-0 place-items-center rounded-full ${tint} text-ink ring-4 ring-paper`}>
                <Icon className="size-6" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 grid size-6 place-items-center rounded-full bg-ink text-[12px] font-bold text-white">
                  {i + 1}
                </span>
              </span>
              <div className="md:mt-6">
                <h3 className="text-[22px] font-bold tracking-tight">
                  <span className="sr-only">Step {i + 1}: </span>
                  {title}
                </h3>
                <p className="mt-2 max-w-[32ch] leading-relaxed text-copy">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- Why Ellivia */

type FlowStep = { icon: LucideIcon; label: string }

const onItsOwn: FlowStep[] = [
  { icon: FileText, label: 'Surprise bill' },
  { icon: BookOpen, label: 'Long policy PDFs' },
  { icon: CircleHelp, label: 'Not sure what applies' },
]
const withEllivia: FlowStep[] = [
  { icon: ScanLine, label: 'Scan the bill' },
  { icon: ListChecks, label: 'Answer a few questions' },
  { icon: CircleCheck, label: 'See where and how to apply' },
]

export function WhyEllivia() {
  return (
    <section aria-labelledby="why-title" id="why" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 id="why-title" className="max-w-[18ch] text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
          Hospital bills can be confusing. Help can be hard to find.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-copy">
          Ellivia makes financial assistance easier to find, starting with bills from RUSH University Medical Center.
        </p>

        <div className="mt-12 space-y-4">
          <Flow title="On its own" steps={onItsOwn} tone="plain" />
          <Flow title="With Ellivia" steps={withEllivia} tone="mint" />
        </div>
        <p className="mt-5 text-[14px] text-muted">
          Illustrative example. The hospital decides who qualifies. Built through Everyone Can Code Chicago’s App
          Accelerator.
        </p>
      </div>
    </section>
  )
}

function Flow({ title, steps, tone }: { title: string; steps: FlowStep[]; tone: 'plain' | 'mint' }) {
  const mint = tone === 'mint'
  return (
    <div className={`rounded-[28px] px-4 py-6 sm:px-8 sm:py-7 ${mint ? 'bg-mint' : 'bg-paper ring-1 ring-line'}`}>
      <h3 className="text-[18px] font-bold tracking-tight sm:text-[20px]">{title}</h3>
      <ol className="mt-5 flex items-start gap-1 sm:gap-4">
        {steps.map(({ icon: Icon, label }, i) => {
          const last = i === steps.length - 1
          return (
            <li key={label} className="flex flex-1 items-start justify-center gap-1 sm:gap-4">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <span
                  className={`grid size-14 place-items-center rounded-2xl sm:size-16 ${
                    mint ? (last ? 'bg-ink text-white' : 'bg-paper text-ink') : last ? 'bg-azure-2 text-muted' : 'bg-azure text-ink'
                  }`}
                >
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <span className={`mt-3 text-[14px] font-semibold leading-snug sm:text-[16px] ${mint ? 'text-ink' : 'text-copy'}`}>
                  {label}
                </span>
              </div>
              {!last && (
                <ArrowRight
                  aria-hidden="true"
                  className={`mt-4 size-5 shrink-0 sm:mt-5 sm:size-6 ${mint ? 'text-ink' : 'text-muted/60'}`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

/* -------------------------------------------------------- Trust & privacy */

const receipt: { item: string; value: string; ok: boolean }[] = [
  { item: 'Your name and email', value: 'Yes', ok: true },
  { item: 'Medical records', value: 'Never', ok: false },
  { item: 'Hospital bills', value: 'Never', ok: false },
  { item: 'Income or insurance details', value: 'Not here', ok: false },
  { item: 'Ads or tracking cookies', value: 'None', ok: false },
]

const promises: { icon: LucideIcon; label: string }[] = [
  { icon: BellRing, label: 'Launch updates only' },
  { icon: ShieldCheck, label: 'Never sold' },
  { icon: Building2, label: 'Not affiliated with RUSH' },
  { icon: Gavel, label: 'RUSH decides who qualifies' },
]

export function TrustPrivacy() {
  return (
    <section aria-labelledby="trust-title" id="privacy" className="bg-baby/45 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <h2 id="trust-title" className="max-w-[15ch] text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
            Joining takes just your name and email.
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-copy">Free, and never your medical or financial info.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {promises.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 rounded-2xl bg-paper/80 px-4 py-3 ring-1 ring-line">
                <Icon className="size-5 shrink-0 text-ink-2" aria-hidden="true" />
                <span className="text-[15px] font-semibold leading-snug">{label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[16px]">
            <a href={privacyHref} className="font-semibold text-link underline underline-offset-4 hover:text-ink">
              Read the privacy policy
            </a>
          </p>
        </div>

        {/* The receipt */}
        <div className="mx-auto w-full max-w-md rotate-1 drop-shadow-[0_24px_30px_rgb(15_47_69/0.18)]">
          <div className="receipt-edge bg-paper px-6 pb-10 pt-7 sm:px-8">
            <p className="text-center text-[15px] font-bold">Ellivia waitlist</p>
            <p className="text-center text-[13px] text-muted">What this website collects</p>
            <dl className="mt-6 space-y-3 border-y-2 border-dashed border-line py-5 text-[15px]">
              {receipt.map((r) => (
                <div key={r.item} className="flex items-center gap-3">
                  <dt className="flex min-w-0 flex-1 items-center gap-2.5">
                    {r.ok ? (
                      <Check className="size-4 shrink-0 text-success" strokeWidth={3} aria-hidden="true" />
                    ) : (
                      <X className="size-4 shrink-0 text-muted" strokeWidth={3} aria-hidden="true" />
                    )}
                    <span className="truncate">{r.item}</span>
                  </dt>
                  <dd className={`font-semibold ${r.ok ? 'text-success' : 'text-ink'}`}>{r.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex items-baseline justify-between text-[22px] font-extrabold">
              <span>Total</span>
              <span className="rounded-md bg-mint px-2">Free</span>
            </div>
            <p className="mt-6 text-center font-hand text-[24px] text-ink-2">Thanks for joining us early!</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- FAQ */

const faqs: { q: string; a: ReactNode }[] = [
  { q: 'Is Ellivia really free?', a: 'Yes. Free to download, free to use, and free to join the waitlist.' },
  {
    q: 'Is Ellivia part of RUSH?',
    a: 'No. Ellivia is independent and not affiliated with RUSH University Medical Center.',
  },
  {
    q: 'Will Ellivia lower my bill?',
    a: 'We can’t promise that. Ellivia shows you programs that may apply and how to apply. The hospital decides.',
  },
  {
    q: 'When does it launch?',
    a: 'Planned for December 2026 on iOS. We’ll email you when it’s out.',
  },
  {
    q: 'What happens to my name and email?',
    a: (
      <>
        Only for launch updates. Ask us to delete them anytime. See the{' '}
        <a href={privacyHref} className="font-semibold text-link underline underline-offset-2">
          privacy policy
        </a>
        .
      </>
    ),
  },
]

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-title" className="text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
          Questions, answered.
        </h2>
        <div className="mt-10 divide-y-2 divide-dashed divide-line border-y-2 border-dashed border-line">
          {faqs.map((f) => (
            <FaqItem key={f.q} q={f.q}>
              {f.a}
            </FaqItem>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqItem({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="group py-1" name="faq">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-4 text-left text-[19px] font-bold [&::-webkit-details-marker]:hidden">
        <span>{q}</span>
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-mint transition group-open:rotate-180">
          <ChevronDown className="size-5" aria-hidden="true" />
        </span>
      </summary>
      <div className="pb-5 pr-12 text-[17px] leading-relaxed text-copy">{children}</div>
    </details>
  )
}

/* ------------------------------------------------------------- Final CTA */

export function FinalCta() {
  return (
    <section id="join" aria-labelledby="final-title" className="scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] bg-mint px-5 py-14 sm:px-12 sm:py-20">
        <div aria-hidden="true" className="sky-grid absolute inset-0 opacity-70" />
        {/* postmark */}
        <div
          aria-hidden="true"
          className="absolute right-5 top-5 hidden size-28 rotate-12 place-items-center rounded-full border-[3px] border-dashed border-ink/35 text-center sm:grid"
        >
          <span className="text-[13px] font-bold leading-tight text-ink/70">
            iOS
            <br />
            Dec 2026
          </span>
        </div>
        <div className="relative mx-auto max-w-xl text-center">
          <h2 id="final-title" className="text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
            Be among the first to try Ellivia.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-ink">
            Join the free waitlist and we’ll let you know when Ellivia is available on the App Store.
          </p>
          <div className="mt-9 rounded-3xl bg-paper p-5 text-left shadow-paper sm:p-6">
            <SignupForm />
          </div>
        </div>
      </div>
    </section>
  )
}
