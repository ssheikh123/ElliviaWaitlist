import { useEffect, useId, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { LogoMark } from './Logo.tsx'
import { homeHref } from '../config.ts'
import { goToSignup } from '../lib/goToSignup.ts'

export const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#why', label: 'Why Ellivia' },
  { href: '#privacy', label: 'Privacy' },
  { href: '#faq', label: 'FAQ' },
] as const

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
  return (
    <span
      className={`shrink-0 items-center gap-1 whitespace-nowrap rounded-full bg-baby px-2.5 py-1 text-[12px] font-semibold text-ink ${className}`}
    >
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        Live on the
        <AppStoreIcon className="size-4" />
        soon
      </span>
      <span className="sr-only">Live on the App Store soon</span>
    </span>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-azure/85 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <a href={homeHref} className="inline-flex shrink-0 items-center gap-2 rounded-lg text-ink sm:gap-2.5" aria-label="Ellivia home">
            <LogoMark className="size-8" />
            <span className="text-[20px] font-extrabold tracking-[-0.03em] sm:text-[22px]" aria-hidden="true">
              Ellivia
            </span>
          </a>
          <LaunchPill className="hidden sm:inline-flex" />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-3 py-2 text-[15px] font-semibold text-ink transition hover:bg-paper/80"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((o) => !o)}
            className="grid size-10 place-items-center rounded-full text-ink transition hover:bg-paper/80 lg:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
          <a
            href="#join"
            onClick={(e) => {
              setOpen(false)
              goToSignup(e)
            }}
            className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-ink px-4 text-[15px] font-semibold text-white transition hover:bg-ink-2 active:scale-[0.98]"
          >
            Join Waitlist
          </a>
        </div>
      </nav>

      <div id={menuId} hidden={!open} className="border-t border-line/80 bg-azure/95 lg:hidden">
        <ul className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-[17px] font-semibold text-ink hover:bg-paper/80"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
