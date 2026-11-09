import type { ReactNode } from 'react'
import { Check, ChevronDown, ListChecks, ScanLine, Signpost, X, type LucideIcon } from 'lucide-react'
import { SignupForm } from './SignupForm.tsx'
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
      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:pb-24 lg:pt-20">
        <div>
          <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-mint px-3.5 py-1.5 text-[14px] font-semibold text-ink ring-1 ring-ink/10">
            <span aria-hidden="true" className="size-2 rounded-full bg-success" />
            Free iOS app, planned for December 2026
          </p>
          <h1
            id="hero-title"
            className="mt-6 max-w-[14ch] text-balance text-[44px] font-extrabold leading-[0.98] tracking-[-0.035em] text-ink [font-variation-settings:'wdth'_90] sm:text-[64px] lg:text-[72px]"
          >
            Medical bills are stressful. Finding help shouldn’t be.
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-copy sm:text-xl">
            Ellivia helps insured families explore hospital financial assistance and understand how to apply. Coming
            soon to iOS.
          </p>

          <div id="join" className="mt-8 max-w-xl scroll-mt-24 rounded-3xl bg-paper/85 p-4 shadow-soft ring-1 ring-line backdrop-blur sm:p-5">
            <SignupForm placement="hero" />
          </div>
        </div>
        <HeroBill />
      </div>
    </section>
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
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-copy">Three steps, all from your phone.</p>

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

const withoutGuide = [
  'The bill arrives with codes you’ve never seen and an amount you didn’t expect.',
  'You search for help and land on a long policy document full of terms.',
  'You set the bill aside, unsure if any help applies to you.',
]
const withEllivia = [
  'You scan the bill with your phone.',
  'You answer a few questions about your household, income, and insurance.',
  'You see assistance programs that may apply, and where and how to apply.',
]

export function WhyEllivia() {
  return (
    <section aria-labelledby="why-title" id="why" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 id="why-title" className="max-w-[16ch] text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
              Hospital bills can be confusing. Help can be hard to find.
            </h2>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-copy">
            <p>
              Even with insurance, an emergency room visit can lead to a bill you didn’t expect. Many hospitals offer
              financial assistance, but the details about who may qualify and how to apply are often spread across
              long documents and websites.
            </p>
            <p>
              Ellivia is designed to make navigating those options easier, starting with bills from RUSH University
              Medical Center. It’s being developed through Everyone Can Code Chicago’s App Accelerator.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          <Story title="The same bill, on its own" items={withoutGuide} tone="plain" />
          <Story title="The same bill, with Ellivia" items={withEllivia} tone="mint" />
        </div>
        <p className="mt-5 text-[15px] text-muted">
          An illustrative example. Ellivia can’t guarantee discounts or approval; the hospital makes the final decision.
        </p>
      </div>
    </section>
  )
}

function Story({ title, items, tone }: { title: string; items: string[]; tone: 'plain' | 'mint' }) {
  const mint = tone === 'mint'
  return (
    <div className={`rounded-[28px] p-6 sm:p-8 ${mint ? 'bg-mint' : 'bg-paper ring-1 ring-line'}`}>
      <h3 className="text-[22px] font-bold tracking-tight">{title}</h3>
      <ol className="mt-6 space-y-5">
        {items.map((text, i) => (
          <li key={text} className="flex gap-4">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-full text-[14px] font-bold ${
                mint ? 'bg-ink text-white' : 'bg-azure-2 text-ink'
              }`}
            >
              {i + 1}
            </span>
            <p className={`pt-1 leading-relaxed ${mint ? 'text-ink' : 'text-copy'}`}>{text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

/* -------------------------------------------------------- Trust & privacy */

const receipt: { item: string; value: string; ok: boolean }[] = [
  { item: 'Your email address', value: 'Yes', ok: true },
  { item: 'Medical records', value: 'Never', ok: false },
  { item: 'Hospital bills', value: 'Never', ok: false },
  { item: 'Income or insurance details', value: 'Not here', ok: false },
  { item: 'Ads or tracking cookies', value: 'None', ok: false },
]

const promises: { title: string; body: string }[] = [
  { title: 'Launch updates only', body: 'We use waitlist emails to tell you when Ellivia launches. We don’t sell them.' },
  {
    title: 'Independent from RUSH',
    body: 'Ellivia is an independent project and is not affiliated with RUSH University Medical Center.',
  },
  {
    title: 'RUSH makes the decisions',
    body: 'Financial assistance eligibility is decided by RUSH. Ellivia can’t guarantee discounts or approval.',
  },
]

export function TrustPrivacy() {
  return (
    <section aria-labelledby="trust-title" id="privacy" className="bg-baby/45 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <h2 id="trust-title" className="max-w-[15ch] text-balance text-[34px] font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-[48px]">
            Joining costs you one email address.
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-copy">
            Ellivia is free, and this website never asks for your medical or financial information.
          </p>
          <ul className="mt-8 space-y-5">
            {promises.map((p) => (
              <li key={p.title} className="border-l-4 border-mint-3 pl-4">
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="mt-1 leading-relaxed text-copy">{p.body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-[16px] text-copy">
            <a href={privacyHref} className="font-semibold text-link underline underline-offset-4 hover:text-ink">
              Read the privacy policy
            </a>{' '}
            for what we collect, how it’s stored, and how to delete it.
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
  { q: 'Is Ellivia really free?', a: 'Yes. The app will be free to download and use, and joining the waitlist is free.' },
  {
    q: 'Is Ellivia part of RUSH?',
    a: 'No. Ellivia is an independent project and is not affiliated with, endorsed by, or sponsored by RUSH University Medical Center.',
  },
  {
    q: 'Will Ellivia lower my bill?',
    a: 'Ellivia can’t promise that. It helps you explore assistance programs that may apply and understand how to apply. The hospital decides who qualifies.',
  },
  {
    q: 'When does it launch?',
    a: 'Ellivia is planned for December 2026 on iOS. If you join the waitlist, we’ll email you when it’s available.',
  },
  {
    q: 'What happens to my email?',
    a: (
      <>
        It’s used only for Ellivia launch updates, and you can ask us to delete it at any time. See the{' '}
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
    <section aria-labelledby="faq-title" className="px-4 py-20 sm:px-6 sm:py-28">
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
    <section aria-labelledby="final-title" className="px-4 pb-20 sm:px-6 sm:pb-28">
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
            <SignupForm placement="footer" />
          </div>
        </div>
      </div>
    </section>
  )
}
