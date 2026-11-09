/** Minimal typed loader for Cloudflare Turnstile (explicit rendering). */

export interface TurnstileRenderOptions {
  sitekey: string
  action?: string
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'flexible' | 'compact'
  appearance?: 'always' | 'execute' | 'interaction-only'
  'response-field'?: boolean
  'refresh-expired'?: 'auto' | 'manual' | 'never'
  callback?: (token: string) => void
  'expired-callback'?: () => void
  'error-callback'?: (code: string) => void
  'timeout-callback'?: () => void
}

export interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let loading: Promise<TurnstileApi> | null = null

export function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (loading) return loading

  loading = new Promise<TurnstileApi>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.defer = true
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile)
      else reject(new Error('Turnstile failed to initialise'))
    }
    script.onerror = () => {
      loading = null
      script.remove()
      reject(new Error('Turnstile script failed to load'))
    }
    document.head.appendChild(script)
  })
  return loading
}
