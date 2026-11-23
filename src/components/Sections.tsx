import type { CSSProperties, ReactNode } from 'react'
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
import { Reveal, Words } from './Reveal.tsx'
import { privacyHref } from '../config.ts'
import { useLang, withLang } from '../i18n/lang.tsx'

const H2 = 'text-balance text-[34px] leading-[1.08] tracking-[-0.01em] sm:text-[50px]'

/* ------------------------------------------------------------------ Hero */

export function Hero() {
  const { t } = useLang()
  const lineA = t.hero.titleA.split(' ').length
  const lineB = t.hero.titleB.join(' ').split(' ').length
  // the highlighter swipes once every word has landed
  const markerStart = 150 + 80 * (lineA + 1 + lineB) + 500
  return (
    <section aria-labelledby="hero-title" className="logo-wash relative overflow-hidden">
      <div aria-hidden="true" className="sky-grid absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-24 size-[520px] rounded-full bg-baby/70 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-24 size-[420px] rounded-full bg-mint/80 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] items-start gap-14 px-4 pb-20 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pb-28 lg:pt-20">
        <div className="lg:pt-20">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex max-w-full items-center gap-2 rounded-full bg-mint px-4 py-2 text-[15px] font-bold text-ink ring-1 ring-ink/10">
              <span aria-hidden="true" className="size-2 rounded-full bg-success" />
              {t.hero.badge}
            </p>
            {/* the nav hides this label on smaller screens, so show it here instead */}
            <LaunchPill className="inline-flex py-2 text-[13px] md:hidden" />
          </div>
          {/* Words drift in one by one; the key replays it when the language changes. */}
          <h1 key={t.hero.titleA} id="hero-title" className="words-on-load mt-7 text-ink">
            <span
              className="block max-w-[13ch] text-balance text-[44px] leading-[1.04] tracking-[-0.015em] sm:text-[62px] lg:text-[70px]"
              style={{ '--start': '150ms' } as CSSProperties}
            >
              <Words text={t.hero.titleA} />
            </span>{' '}
            <span
              className="mt-4 block text-[28px] leading-[1.2] text-ink-2 sm:text-[38px] lg:text-[42px]"
              style={{ '--start': `${150 + 80 * (lineA + 1)}ms` } as CSSProperties}
            >
              <Words text={t.hero.titleB[0]} />{' '}
              <span className="marker" style={{ '--start': `${markerStart}ms` } as CSSProperties}>
                <Words text={t.hero.titleB[1]} start={t.hero.titleB[0].split(' ').length} />
              </span>
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-pretty text-lg leading-[1.7] text-copy sm:text-xl sm:leading-[1.7]">
            {t.hero.intro}
          </p>

          <JoinCta />
        </div>
        <div className="animate-drop" style={{ animationDelay: '300ms' }}>
          <HeroBill />
        </div>
      </div>
    </section>
  )
}

function JoinCta() {
  const { t } = useLang()
  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <a
          href="#join"
          onClick={goToSignup}
          className="group inline-flex h-16 items-center gap-4 rounded-full bg-mint-2 pl-7 pr-2 text-[19px] font-bold text-ink shadow-paper ring-1 ring-ink/10 transition hover:-translate-y-0.5 hover:bg-mint-3 active:scale-[0.98]"
        >
          {t.hero.cta}
          <span className="grid size-12 place-items-center rounded-full bg-ink text-white transition group-hover:translate-y-0.5">
            <ArrowDown className="size-5" aria-hidden="true" />
          </span>
        </a>
        <p className="-rotate-2 font-hand text-[26px] leading-none text-ink-2">{t.hero.hand}</p>
      </div>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[16px] text-copy">
        {t.hero.checks.map((c) => (
          <li key={c} className="flex items-center gap-2">
            <BadgeCheck className="size-[18px] text-success" aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ---------------------------------------------------------- How it works */

const stepStyle: { icon: LucideIcon; tint: string }[] = [
  { icon: ScanLine, tint: 'bg-mint' },
  { icon: ListChecks, tint: 'bg-baby' },
  { icon: Signpost, tint: 'bg-sand' },
]

export function HowItWorks() {
  const { t } = useLang()
  return (
    <section aria-labelledby="how-title" id="how-it-works" className="bg-paper px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 id="how-title" className={`max-w-[18ch] ${H2}`}>
          {t.how.title}
        </h2>

        <Reveal as="ol" variant="route" className="relative mt-14 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-10">
          {/* the route connecting the stops */}
          <span
            aria-hidden="true"
            className="route absolute bottom-8 left-[30px] top-8 border-l-[3px] border-dotted border-sage md:bottom-auto md:left-[4%] md:right-[30%] md:top-[30px] md:border-l-0 md:border-t-[3px]"
          />
          {t.how.steps.map(({ title, body }, i) => {
            const { icon: Icon, tint } = stepStyle[i]!
            return (
              <li key={title} className="relative flex gap-6 md:block">
                <span
                  className={`stop relative grid size-16 shrink-0 place-items-center rounded-full ${tint} text-ink ring-[6px] ring-paper`}
                  style={{ '--i': i } as CSSProperties}
                >
                  <Icon className="size-7" aria-hidden="true" />
                  <span className="absolute -right-1 -top-1 grid size-7 place-items-center rounded-full bg-ink text-[13px] font-bold text-white">
                    {i + 1}
                  </span>
                </span>
                <div className="md:mt-8">
                  <h3 className="font-display text-[24px] leading-tight">
                    <span className="sr-only">{t.how.step(i + 1)}</span>
                    {title}
                  </h3>
                  <p className="mt-3 max-w-[32ch] text-[17px] leading-[1.7] text-copy">{body}</p>
                </div>
              </li>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

/* ----------------------------------------------------------- Why Ellivia */

const ownIcons: LucideIcon[] = [FileText, BookOpen, CircleHelp]
const withIcons: LucideIcon[] = [ScanLine, ListChecks, CircleCheck]

export function WhyEllivia() {
  const { t } = useLang()
  return (
    <section aria-labelledby="why-title" id="why" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2 id="why-title" className={`max-w-[20ch] ${H2}`}>
          {t.why.title}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-[1.7] text-copy">{t.why.body}</p>

        <div className="mt-12 space-y-6">
          <Flow title={t.why.ownTitle} labels={t.why.own} icons={ownIcons} tone="plain" />
          <Reveal variant="wipe">
            <Flow title={t.why.withTitle} labels={t.why.with} icons={withIcons} tone="mint" />
          </Reveal>
        </div>
        <p className="mt-7 text-[14px] leading-relaxed text-muted">{t.why.note}</p>
      </div>
    </section>
  )
}

function Flow({
  title,
  labels,
  icons,
  tone,
}: {
  title: string
  labels: string[]
  icons: LucideIcon[]
  tone: 'plain' | 'mint'
}) {
  const mint = tone === 'mint'
  return (
    <div className={`rounded-[30px] px-4 py-8 sm:px-10 sm:py-9 ${mint ? 'bg-mint' : 'bg-paper ring-1 ring-line'}`}>
      <h3 className="font-display text-[21px] sm:text-[24px]">{title}</h3>
      <ol className="mt-7 flex items-start gap-1 sm:gap-5">
        {labels.map((label, i) => {
          const Icon = icons[i]!
          const last = i === labels.length - 1
          return (
            <li key={label} className="flex flex-1 items-start justify-center gap-1 sm:gap-5">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <span
                  className={`grid size-14 place-items-center rounded-2xl sm:size-[68px] ${
                    mint ? (last ? 'bg-ink text-white' : 'bg-paper text-ink') : last ? 'bg-azure-2 text-muted' : 'bg-azure text-ink'
                  }`}
                >
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <span className={`mt-4 text-[14px] font-semibold leading-snug sm:text-[16px] ${mint ? 'text-ink' : 'text-copy'}`}>
                  {label}
                </span>
              </div>
              {!last && (
                <ArrowRight
                  aria-hidden="true"
                  className={`mt-4 size-5 shrink-0 sm:mt-6 sm:size-6 ${mint ? 'text-ink' : 'text-muted/60'}`}
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

const promiseIcons: LucideIcon[] = [BellRing, ShieldCheck, Building2, Gavel]

export function TrustPrivacy() {
  const { t, lang } = useLang()
  return (
    <section aria-labelledby="trust-title" id="privacy" className="bg-sand/70 px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <h2 id="trust-title" className={`max-w-[16ch] ${H2}`}>
            {t.trust.title}
          </h2>
          <p className="mt-6 max-w-md text-lg leading-[1.7] text-copy">{t.trust.sub}</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {t.trust.promises.map((label, i) => {
              const Icon = promiseIcons[i]!
              return (
                <li key={label} className="flex items-center gap-3 rounded-2xl bg-paper/85 px-5 py-4 ring-1 ring-line">
                  <Icon className="size-5 shrink-0 text-ink-2" aria-hidden="true" />
                  <span className="text-[15px] font-semibold leading-snug">{label}</span>
                </li>
              )
            })}
          </ul>
          <p className="mt-8 text-[16px]">
            <a href={withLang(privacyHref, lang)} className="font-semibold text-link underline underline-offset-4 hover:text-ink">
              {t.trust.readPolicy}
            </a>
          </p>
        </div>

        {/* The receipt */}
        <Reveal variant="print" className="mx-auto w-full max-w-md">
          <div className="rotate-1 drop-shadow-[0_24px_30px_rgb(23_63_42/0.18)]">
            <div className="receipt-paper receipt-edge bg-paper px-6 pb-12 pt-8 sm:px-9">
              <p className="text-center text-[16px] font-bold">{t.trust.receiptTitle}</p>
              <p className="mt-0.5 text-center text-[13px] text-muted">{t.trust.receiptSub}</p>
              <dl className="mt-7 space-y-4 border-y-2 border-dashed border-line py-6 text-[15px]">
                {t.trust.receipt.map((r, i) => {
                  const ok = i === 0
                  return (
                    <div key={r.item} className="flex items-center gap-3">
                      <dt className="flex min-w-0 flex-1 items-center gap-2.5">
                        {ok ? (
                          <Check className="size-4 shrink-0 text-success" strokeWidth={3} aria-hidden="true" />
                        ) : (
                          <X className="size-4 shrink-0 text-muted" strokeWidth={3} aria-hidden="true" />
                        )}
                        <span className="truncate">{r.item}</span>
                      </dt>
                      <dd className={`font-semibold ${ok ? 'text-success' : 'text-ink'}`}>{r.value}</dd>
                    </div>
                  )
                })}
              </dl>
              <div className="mt-6 flex items-baseline justify-between text-[22px] font-extrabold">
                <span>{t.trust.total}</span>
                <span className="rounded-md bg-mint px-2">{t.trust.free}</span>
              </div>
              <p className="mt-7 text-center font-hand text-[25px] text-ink-2">{t.trust.thanks}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------- FAQ */

export function Faq() {
  const { t, lang } = useLang()
  const items: { q: string; a: ReactNode }[] = [
    ...t.faq.items,
    {
      q: t.faq.dataQ,
      a: (
        <>
          {t.faq.dataBefore}
          <a href={withLang(privacyHref, lang)} className="font-semibold text-link underline underline-offset-2">
            {t.faq.dataLink}
          </a>
          {t.faq.dataAfter}
        </>
      ),
    },
  ]
  return (
    <section id="faq" aria-labelledby="faq-title" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-title" className={H2}>
          {t.faq.title}
        </h2>
        <div className="mt-10 divide-y-2 divide-dashed divide-line border-y-2 border-dashed border-line">
          {items.map((f) => (
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
    <details className="group py-2" name="faq">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg py-5 text-left text-[19px] font-bold [&::-webkit-details-marker]:hidden">
        <span>{q}</span>
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint transition group-open:rotate-180">
          <ChevronDown className="size-5" aria-hidden="true" />
        </span>
      </summary>
      <div className="pb-6 pr-12 text-[17px] leading-[1.7] text-copy">{children}</div>
    </details>
  )
}

/* ------------------------------------------------------------- Final CTA */

export function FinalCta() {
  const { t } = useLang()
  return (
    <section id="join" aria-labelledby="final-title" className="px-4 pb-20 sm:px-6 sm:pb-28">
      <Reveal variant="stamp" className="relative mx-auto max-w-5xl overflow-hidden rounded-[40px] bg-mint px-5 py-16 sm:px-12 sm:py-20">
        <div aria-hidden="true" className="sky-grid absolute inset-0 opacity-70" />
        {/* postmark */}
        <div
          aria-hidden="true"
          className="postmark absolute right-6 top-6 hidden size-28 rotate-12 place-items-center rounded-full border-[3px] border-dashed border-ink/35 text-center sm:grid"
        >
          <span className="text-[13px] font-bold leading-tight text-ink/70">
            {t.final.postmark[0]}
            <br />
            {t.final.postmark[1]}
          </span>
        </div>
        <div className="relative mx-auto max-w-xl text-center">
          <h2 id="final-title" className={H2}>
            {t.final.title}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg leading-[1.7] text-ink">{t.final.body}</p>
          <div className="mt-10 rounded-3xl bg-paper p-6 text-left shadow-paper sm:p-8">
            <SignupForm />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
