import { LogoMark } from './Logo.tsx'
import { homeHref } from '../config.ts'

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-azure/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl backdrop-saturate-150">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <a href={homeHref} className="inline-flex shrink-0 items-center gap-2 rounded-lg text-ink sm:gap-2.5" aria-label="Ellivia home">
            <LogoMark className="size-8" />
            <span className="hidden text-[20px] font-extrabold tracking-[-0.03em] min-[370px]:inline sm:text-[22px]" aria-hidden="true">
              Ellivia
            </span>
          </a>
          <span className="hidden shrink-0 items-center whitespace-nowrap rounded-full bg-baby px-2.5 py-1 text-[11px] font-semibold text-ink min-[360px]:inline-flex sm:text-xs">
            Coming Soon to iOS
          </span>
        </div>
        <a
          href="#join"
          className="inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-full bg-ink px-3.5 text-[14px] font-semibold text-white transition hover:bg-ink-2 active:scale-[0.98] sm:px-4 sm:text-[15px]"
        >
          Join Waitlist
        </a>
      </nav>
    </header>
  )
}
