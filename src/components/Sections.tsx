import {
  BadgeCheck,
  BellRing,
  BookOpenText,
  Building2,
  FileX2,
  Gavel,
  HeartHandshake,
  ListChecks,
  Mail,
  ScanLine,
  Signpost,
  Smartphone,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { SignupForm } from './SignupForm.tsx'
import { PhonePreview } from './PhonePreview.tsx'
import { privacyHref } from '../config.ts'

function SectionHeading({ eyebrow, title, intro, id }: { eyebrow: string; title: string; intro?: string; id: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-600">{eyebrow}</p>
      <h2 id={id} className="mt-3 text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] text-navy-900 sm:text-[42px]">
        {title}
      </h2>
      {intro && <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-copy">{intro}</p>}
    </div>
  )
}

const heroPoints = ['100% free app', 'Only your email to join', 'No medical info collected']

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-gradient-to-b from-ice to-white">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-14 px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="animate-rise text-center lg:text-left">
          <p className="inline-flex max-w-full items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-medium text-navy-800 shadow-soft sm:text-sm">
            <Sparkles className="size-4 shrink-0 text-accent" aria-hidden="true" />
            Free iOS app · Planned for December 2026
          </p>
          <h1
            id="hero-title"
            className="mx-auto mt-6 max-w-[16ch] text-balance text-[40px] font-semibold leading-[1.04] tracking-[-0.035em] text-navy-900 sm:text-[56px] lg:mx-0 lg:text-[64px]"
          >
            Medical bills are stressful. Finding help shouldn’t be.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-slate-copy sm:text-xl lg:mx-0">
            Ellivia helps insured families explore hospital financial assistance and understand how to apply. Coming
            soon to iOS.
          </p>

          <div id="join" className="mx-auto mt-8 max-w-xl scroll-mt-24 lg:mx-0">
            <SignupForm placement="hero" />
          </div>

          <ul className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-copy lg:mx-0 lg:justify-start">
            {heroPoints.map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <BadgeCheck className="size-4 text-accent" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <PhonePreview />
      </div>
    </section>
  )
}

const steps: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: ScanLine, title: 'Scan Your Bill', body: 'Start by scanning your hospital bill with your phone.' },
  {
    icon: ListChecks,
    title: 'Explore Financial Assistance',
    body: 'Answer a few questions to discover assistance programs that may apply to you.',
  },
  { icon: Signpost, title: 'Understand Your Next Steps', body: 'Learn where and how to apply for available assistance.' },
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-title" id="how-it-works" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="how-title"
          eyebrow="How it works"
          title="Three simple steps, right from your phone."
          intro="The Ellivia app is being designed to guide you from a confusing bill to a clear plan."
        />
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="group relative rounded-3xl border border-line bg-white p-7 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent-600 transition group-hover:bg-navy-900 group-hover:text-white">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-slate-soft" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-navy-900">
                <span className="sr-only">Step {i + 1}: </span>
                {title}
              </h3>
              <p className="mt-2 leading-relaxed text-slate-copy">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

const reasons: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BookOpenText,
    title: 'Plain language',
    body: 'Clear explanations instead of billing jargon, so you can understand what options may exist.',
  },
  {
    icon: Smartphone,
    title: 'Made for your phone',
    body: 'Designed for iPhone, so you can get started from wherever you are, at your own pace.',
  },
  {
    icon: HeartHandshake,
    title: 'Free, with no catch',
    body: 'Ellivia is a free app, built to help families navigate a stressful moment.',
  },
]

export function WhyEllivia() {
  return (
    <section aria-labelledby="why-title" id="why" className="bg-ice px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-600">Why Ellivia</p>
          <h2 id="why-title" className="mt-3 text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] text-navy-900 sm:text-[42px]">
            Hospital bills can be confusing. Help can be hard to find.
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-copy">
            <p>
              Even with insurance, an emergency room visit can lead to a bill you didn’t expect. Many hospitals offer
              financial assistance, but the details about who may qualify and how to apply are often spread across
              long documents and websites.
            </p>
            <p>
              Ellivia is designed to make navigating those options easier. It brings the information together in one
              place and walks you through it step by step, starting with bills from RUSH University Medical Center.
            </p>
            <p className="text-base text-slate-soft">
              Ellivia is being developed through Everyone Can Code Chicago’s App Accelerator.
            </p>
          </div>
        </div>
        <ul className="grid content-center gap-4">
          {reasons.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex gap-4 rounded-3xl bg-white p-6 shadow-soft">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-navy-900 text-white">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-navy-900">{title}</h3>
                <p className="mt-1 leading-relaxed text-slate-copy">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const trustItems: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: BadgeCheck, title: 'Ellivia is free', body: 'The app will be free to download and use.' },
  { icon: Mail, title: 'Just your email', body: 'Joining the waitlist only requires an email address.' },
  {
    icon: FileX2,
    title: 'No medical records here',
    body: 'This website does not collect medical records, hospital bills, or financial documents.',
  },
  {
    icon: BellRing,
    title: 'Launch notifications only',
    body: 'Waitlist emails are used to tell you about Ellivia’s launch. We don’t sell them.',
  },
  {
    icon: Building2,
    title: 'Independent from RUSH',
    body: 'Ellivia is an independent project and is not affiliated with RUSH University Medical Center.',
  },
  {
    icon: Gavel,
    title: 'RUSH makes the decisions',
    body: 'Financial assistance eligibility is decided by RUSH. Ellivia can’t guarantee discounts or approval.',
  },
]

export function TrustPrivacy() {
  return (
    <section aria-labelledby="trust-title" id="privacy" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="trust-title" eyebrow="Trust & privacy" title="Simple, honest, and respectful of your privacy." />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trustItems.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-3xl border border-line bg-white p-6 transition hover:border-[#c9d6e8]">
              <Icon className="size-6 text-accent-600" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold tracking-tight text-navy-900">{title}</h3>
              <p className="mt-1.5 leading-relaxed text-slate-copy">{body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-center text-[15px] text-slate-copy">
          Want the details?{' '}
          <a href={privacyHref} className="font-semibold text-accent-600 underline underline-offset-4 hover:text-navy-900">
            Read our privacy policy
          </a>
          , which covers what we collect, how it’s stored, and how to delete it.
        </p>
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="px-4 pb-20 sm:px-6 sm:pb-28">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-navy-900 px-5 py-14 text-center sm:px-12 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/25 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-[#5b93f5]/15 blur-3xl" />
        <div className="relative">
          <h2 id="final-title" className="mx-auto max-w-[18ch] text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.025em] text-white sm:text-[44px]">
            Be among the first to try Ellivia.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/75">
            Join the free waitlist and we’ll let you know when Ellivia is available on the App Store.
          </p>
          <div className="mx-auto mt-9 max-w-xl rounded-3xl bg-white p-5 text-left shadow-lift sm:p-6">
            <SignupForm placement="footer" />
          </div>
        </div>
      </div>
    </section>
  )
}
