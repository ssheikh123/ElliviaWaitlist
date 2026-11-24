import { useEffect, useId, useState } from 'react'
import { Languages, Menu, X } from 'lucide-react'
import { LogoMark } from './Logo.tsx'
import { homeHref } from '../config.ts'
import { goToSignup } from '../lib/goToSignup.ts'
import { useLang, withLang, type Lang } from '../i18n/lang.tsx'

const NAV_LINKS = [
  { href: '#how-it-works', key: 'how' },
  { href: '#why', key: 'why' },
  { href: '#privacy', key: 'privacy' },
  { href: '#faq', key: 'faq' },
] as const

/** Switches between English and Spanish. Shows the other language, written in that language. */
export function LanguageSwitch({ className = '' }: { className?: string }) {
  const { t, setLang } = useLang()
  const target = t.nav.switchTo
  return (
    <button
      type="button"
      lang={target.lang}
      onClick={() => setLang(target.lang as Lang)}
      title={target.aria}
      className={`inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3 text-[15px] font-bold text-ink ring-1 ring-ink/15 transition hover:bg-paper/80 ${className}`}
    >
      <Languages className="size-[18px]" aria-hidden="true" />
      <span aria-hidden="true" className="sm:hidden">
        {target.short}
      </span>
      <span className="sr-only sm:not-sr-only">{target.label}</span>
    </button>
  )
}

/**
 * App Store icon, drawn inline so it renders on every device: a blue rounded
 * square with the white "A" made of crossed sticks.
 */
function AppStoreIcon({ className = 'size-4' }: { className?: string }) {
  const gid = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gid} x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1ac2fb" />
          <stop offset="1" stopColor="#1e6ff1" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="5.4" fill={`url(#${gid})`} />
      <g stroke="#fff" strokeWidth="1.9" strokeLinecap="round" fill="none">
        <path d="M13.1 5.6 7.3 15.6" />
        <path d="M10.9 5.6l5.8 10" />
        <path d="M5.6 13.5h12.8" />
        <path d="M6.6 17.6l.6-1" />
      </g>
    </svg>
  )
}

export function LaunchPill({ className = '' }: { className?: string }) {
  const { t } = useLang()
  return (
    <span
      className={`shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-baby px-2.5 py-1 text-[12px] font-semibold text-ink ${className}`}
    >
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        {t.nav.launchBefore}
        <AppStoreIcon className="size-4" />
        {t.nav.launchAfter}
      </span>
      <span className="sr-only">{t.nav.launchSr}</span>
    </span>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const { t, lang } = useLang()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-azure/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <nav
        aria-label={t.nav.main}
        className="mx-auto flex h-[76px] max-w-[1360px] items-center justify-between gap-2 px-4 sm:h-[96px] sm:gap-3 sm:px-8 lg:px-12"
      >
        <div className="flex min-w-0 items-center gap-4">
          <a
            href={withLang(homeHref, lang)}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-xl text-ink sm:gap-3"
            aria-label={t.nav.home}
          >
            <LogoMark className="size-12 sm:size-16" />
            <span className="font-display text-[27px] tracking-[-0.005em] sm:text-[33px]" aria-hidden="true">
              Ellivia
            </span>
          </a>
          <LaunchPill className="hidden md:inline-flex" />
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ul className="hidden items-center gap-1 xl:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3.5 py-2.5 text-[16px] font-semibold text-ink transition hover:bg-paper/80"
                >
                  {t.nav.links[l.key]}
                </a>
              </li>
            ))}
          </ul>
          <LanguageSwitch />
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
            className="grid size-11 place-items-center rounded-full text-ink transition hover:bg-paper/80 xl:hidden"
          >
            {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
            <span className="sr-only">{open ? t.nav.closeMenu : t.nav.openMenu}</span>
          </button>
          <a
            href="#join"
            onClick={(e) => {
              setOpen(false)
              goToSignup(e)
            }}
            className="inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-full bg-ink px-4 text-[15px] font-bold text-white transition hover:bg-ink-2 active:scale-[0.98] sm:h-12 sm:px-5 sm:text-[16px]"
          >
            <span className="sm:hidden">{t.nav.joinShort}</span>
            <span className="hidden sm:inline">{t.nav.join}</span>
          </a>
        </div>
      </nav>

      <div id={menuId} hidden={!open} className="border-t border-line/80 bg-azure/95 xl:hidden">
        <ul className="mx-auto max-w-[1360px] px-4 py-3 sm:px-8 lg:px-12">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3.5 text-[18px] font-semibold text-ink hover:bg-paper/80"
              >
                {t.nav.links[l.key]}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
