import { Smartphone } from 'lucide-react'
import { LogoMark } from './Logo.tsx'
import { homeHref } from '../config.ts'

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a href={homeHref} className="inline-flex shrink-0 items-center gap-2 rounded-lg text-navy-900 sm:gap-2.5" aria-label="Ellivia home">
            <LogoMark className="size-8" />
            <span className="hidden text-[19px] font-semibold tracking-[-0.02em] min-[370px]:inline sm:text-[21px]" aria-hidden="true">
              Ellivia
            </span>
          </a>
          <span className="hidden shrink-0 items-center gap-1 min-[360px]:inline-flex whitespace-nowrap rounded-full border border-line bg-ice px-2 py-1 text-[11px] font-medium text-navy-800 sm:gap-1.5 sm:px-2.5 sm:text-xs">
            <Smartphone className="hidden size-3.5 sm:block" aria-hidden="true" />
            Coming Soon to iOS
          </span>
        </div>
        <a
          href="#join"
          className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-navy-900 px-3.5 text-[14px] font-semibold text-white transition hover:bg-navy-800 active:scale-[0.98] sm:px-4 sm:text-[15px]"
        >
          Join Waitlist
        </a>
      </nav>
    </header>
  )
}
