import type { ReactNode } from 'react'
import { config } from '../config.ts'

export const CONTACT_EMAIL = config.contactEmail || 'ellivia.org@gmail.com'
export const PUBLIC_URL = 'https://ssheikh123.github.io/ElliviaWaitlist/privacy/'

export function Part({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-20 border-t border-line pt-12">
      <h2 className="text-[28px] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-[32px]">{title}</h2>
      {children}
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h3 className="text-xl font-bold tracking-tight text-ink">{title}</h3>
      <div className="mt-4 space-y-4 text-[17px] leading-[1.75] text-copy [&_ol>li]:ml-5 [&_ol>li]:list-decimal [&_ol>li]:pl-1 [&_ol]:space-y-2.5 [&_ul>li]:ml-5 [&_ul>li]:list-disc [&_ul>li]:pl-1 [&_ul]:space-y-2.5">
        {children}
      </div>
    </section>
  )
}

export function B({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-ink">{children}</strong>
}

export function L({ href, lang, children }: { href: string; lang?: string; children: ReactNode }) {
  const external = href.startsWith('http')
  return (
    <a
      href={href}
      lang={lang}
      className="font-medium text-link underline underline-offset-2"
      {...(external ? { rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

export function Contact() {
  return <L href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</L>
}
