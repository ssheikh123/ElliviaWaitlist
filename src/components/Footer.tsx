import { Wordmark } from './Logo.tsx'
import { config, privacyHref } from '../config.ts'
import { useLang, withLang } from '../i18n/lang.tsx'

export function Footer() {
  const { t, lang } = useLang()
  return (
    <footer className="bg-ink px-5 sm:px-8 lg:px-12 pb-[calc(3rem+env(safe-area-inset-bottom))] pt-16 text-white sm:pt-20">
      <div className="mx-auto max-w-[1360px]">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="inline-flex rounded-2xl bg-azure px-3.5 py-2.5">
              <Wordmark />
            </span>
            <p className="mt-5 max-w-sm text-[15px] leading-[1.7] text-white/80">{t.footer.tagline}</p>
          </div>
          <nav aria-label={t.footer.label} className="flex flex-col gap-3 text-[15px]">
            <a href={withLang(privacyHref, lang)} className="font-semibold text-white underline-offset-4 hover:underline">
              {t.footer.privacy}
            </a>
            {config.contactEmail ? (
              <a href={`mailto:${config.contactEmail}`} className="font-semibold text-white underline-offset-4 hover:underline">
                {config.contactEmail}
              </a>
            ) : (
              <span className="text-white/75">{t.footer.contactSoon}</span>
            )}
          </nav>
        </div>
        <div className="mt-12 space-y-3 border-t border-white/15 pt-7 text-sm leading-[1.7] text-white/75">
          <p>{t.footer.disclaimer}</p>
          <p>{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  )
}
