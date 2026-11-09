import { useEffect, useRef } from 'react'
import { loadTurnstile } from '../lib/turnstile.ts'
import { config } from '../config.ts'

export interface TurnstileWidgetProps {
  /** Increment to force a fresh challenge (tokens are single-use). */
  resetKey: number
  onToken: (token: string) => void
  onExpire: () => void
  onError: (kind: 'load' | 'challenge') => void
}

/**
 * Cloudflare Turnstile in Managed mode. Most visitors pass automatically;
 * Cloudflare shows a checkbox only when it needs more signal.
 */
export function TurnstileWidget({ resetKey, onToken, onExpire, onError }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const handlers = useRef({ onToken, onExpire, onError })
  handlers.current = { onToken, onExpire, onError }

  useEffect(() => {
    let cancelled = false
    loadTurnstile()
      .then((turnstile) => {
        if (cancelled || !containerRef.current || widgetIdRef.current) return
        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: config.turnstileSiteKey,
          action: 'join_waitlist',
          theme: 'light',
          size: 'flexible',
          'response-field': false,
          'refresh-expired': 'auto',
          callback: (token) => handlers.current.onToken(token),
          'expired-callback': () => handlers.current.onExpire(),
          'timeout-callback': () => handlers.current.onExpire(),
          'error-callback': () => handlers.current.onError('challenge'),
        })
      })
      .catch(() => {
        if (!cancelled) handlers.current.onError('load')
      })

    return () => {
      cancelled = true
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
    }
  }, [resetKey])

  return <div ref={containerRef} className="min-h-[65px] w-full" data-testid="turnstile-container" />
}
