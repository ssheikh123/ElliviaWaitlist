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

/** Apple's logo, drawn inline so it renders on every device (not just Apple ones). */
function AppleLogo({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.77 1.1 1.68 2.34 2.87 2.3 1.15-.05 1.59-.75 2.98-.75 1.39 0 1.78.75 3 .72 1.24-.02 2.03-1.12 2.78-2.23.88-1.28 1.24-2.52 1.26-2.59-.03-.01-2.42-.93-2.44-3.67ZM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28Z" />
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
        <AppleLogo className="-mt-0.5 size-3.5" />
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
