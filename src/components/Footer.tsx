import { Wordmark } from './Logo.tsx'
import { config, privacyHref } from '../config.ts'

export function Footer() {
  return (
    <footer className="border-t border-line bg-ice px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Wordmark />
            <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-slate-copy">
              A free iOS app, coming soon, to help insured families explore hospital financial assistance.
            </p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-2 text-[15px]">
            <a href={privacyHref} className="font-medium text-navy-900 underline-offset-4 hover:underline">
              Privacy Policy
            </a>
            {config.contactEmail ? (
              <a href={`mailto:${config.contactEmail}`} className="font-medium text-navy-900 underline-offset-4 hover:underline">
                {config.contactEmail}
              </a>
            ) : (
              <span className="text-slate-soft">Contact email coming soon</span>
            )}
          </nav>
        </div>
        <div className="mt-10 space-y-3 border-t border-line pt-6 text-sm leading-relaxed text-slate-soft">
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
