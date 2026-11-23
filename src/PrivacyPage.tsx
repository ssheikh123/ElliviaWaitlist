// Ellivia Privacy Policy for the waitlist website (ssheikh123/ElliviaWaitlist → src/PrivacyPage.tsx).
// Combined policy for the iPhone app AND the website/waitlist. This is the URL submitted to App Store Connect.
// The text is in src/privacy/PolicyEn.tsx (source of truth, kept in sync with the app's PrivacyPolicy.md)
// and src/privacy/PolicyEs.tsx (Spanish translation). Change both, and bump both dates.

import { ArrowLeft } from 'lucide-react'
import { Wordmark } from './components/Logo.tsx'
import { Footer } from './components/Footer.tsx'
import { LanguageSwitch } from './components/Nav.tsx'
import { homeHref } from './config.ts'
import { useLang, withLang } from './i18n/lang.tsx'
import { PolicyEn } from './privacy/PolicyEn.tsx'
import { PolicyEs } from './privacy/PolicyEs.tsx'

export { PRIVACY_LAST_UPDATED_EN as PRIVACY_LAST_UPDATED } from './privacy/PolicyEn.tsx'

export default function PrivacyPage() {
  const { t, lang } = useLang()
  const home = withLang(homeHref, lang)
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-azure/90 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-3xl items-center justify-between gap-2 px-4 sm:h-[88px] sm:px-6">
          <a href={home} aria-label={t.nav.home} className="shrink-0 rounded-xl">
            <Wordmark large />
          </a>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <a
              href={home}
              className="inline-flex h-11 items-center gap-1.5 rounded-full px-3 text-[15px] font-semibold text-ink hover:bg-paper/80"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">{t.nav.backHome}</span>
            </a>
          </div>
        </div>
      </header>

      <main
        id="main"
        className="mx-auto my-12 max-w-3xl rounded-[32px] bg-paper px-5 py-14 shadow-soft sm:my-16 sm:px-14 sm:py-20"
      >
        {lang === 'es' ? <PolicyEs /> : <PolicyEn />}
      </main>
      <Footer />
    </>
  )
}
