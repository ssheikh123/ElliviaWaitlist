import { Wordmark } from './Logo.tsx'
import { config, privacyHref } from '../config.ts'

export function Footer() {
  return (
    <footer className="bg-ink px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-14 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex rounded-2xl bg-azure px-3 py-2">
              <Wordmark />
            </span>
            <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-white/80">
              A free iOS app, coming soon, to help insured families explore hospital financial assistance.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2 text-[15px]">
            <a href={privacyHref} className="font-semibold text-white underline-offset-4 hover:underline">
              Privacy Policy
            </a>
            {config.contactEmail ? (
              <a href={`mailto:${config.contactEmail}`} className="font-semibold text-white underline-offset-4 hover:underline">
                {config.contactEmail}
              </a>
            ) : (
              <span className="text-white/75">Contact email coming soon</span>
            )}
          </nav>
        </div>
        <div className="mt-10 space-y-3 border-t border-white/15 pt-6 text-sm leading-relaxed text-white/75">
          <p>
            Ellivia is an independent project and is not affiliated with, endorsed by, or sponsored by RUSH University
            Medical Center. Ellivia does not guarantee discounts, financial assistance, or eligibility. All financial
            assistance decisions are made by the hospital. Ellivia does not provide medical, legal, or financial advice.
          </p>
          <p>© 2026 Ellivia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
