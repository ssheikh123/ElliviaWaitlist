import { flushSync } from 'react-dom'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en, es, type Strings } from './strings.ts'

export type Lang = 'en' | 'es'

const DICTIONARIES: Record<Lang, Strings> = { en, es }

/** The browser's own preference. Nothing about the choice is stored; it travels in ?lang= instead. */
export function browserLang(): Lang {
  const preferred = typeof navigator !== 'undefined' ? (navigator.languages?.[0] ?? navigator.language ?? '') : ''
  return preferred.toLowerCase().startsWith('es') ? 'es' : 'en'
}

/** ?lang= (set by the language switch and our links) beats the browser's language. */
export function detectLang(): Lang {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('lang')
    if (fromUrl === 'en' || fromUrl === 'es') return fromUrl
  } catch {
    /* ignore */
  }
  return browserLang()
}

/**
 * Adds ?lang= to an internal link when the language differs from the browser's,
 * so a chosen language carries over to the next page.
 */
export function withLang(href: string, lang: Lang): string {
  if (lang === browserLang()) return href
  const [path = '', hash = ''] = href.split('#')
  const sep = path.includes('?') ? '&' : '?'
  return `${path}${sep}lang=${lang}${hash ? `#${hash}` : ''}`
}

interface LangContextValue {
  lang: Lang
  t: Strings
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextValue>({ lang: 'en', t: en, setLang: () => {} })

export function LangProvider({
  children,
  page,
  initial,
}: {
  children: ReactNode
  /** Which page's <title> and description to keep in sync with the language. */
  page: 'home' | 'privacy'
  initial?: Lang
}) {
  const [lang, setLangState] = useState<Lang>(() => initial ?? detectLang())
  const t = DICTIONARIES[lang]

  const setLang = useCallback((next: Lang) => {
    // Cross-fade the page between languages where the browser supports view transitions.
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (typeof document.startViewTransition === 'function' && !reduce) {
      document.startViewTransition(() => flushSync(() => setLangState(next)))
    } else {
      setLangState(next)
    }
    try {
      const url = new URL(window.location.href)
      if (next !== browserLang()) url.searchParams.set('lang', next)
      else url.searchParams.delete('lang')
      window.history.replaceState(window.history.state, '', url)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    const meta = page === 'home' ? t.meta.home : t.meta.privacy
    document.title = meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description)
  }, [lang, page, t])

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}
