/** Public, build-time configuration. Every value here ships to the browser. */
const env = import.meta.env

export const config = {
  supabaseUrl: (env.VITE_SUPABASE_URL ?? '').trim(),
  publishableKey: (env.VITE_SUPABASE_PUBLISHABLE_KEY ?? '').trim(),
  functionUrl: (
    env.VITE_WAITLIST_FUNCTION_URL ||
    (env.VITE_SUPABASE_URL ? `${env.VITE_SUPABASE_URL.replace(/\/$/, '')}/functions/v1/join-waitlist` : '')
  ).trim(),
  turnstileSiteKey: (env.VITE_TURNSTILE_SITE_KEY ?? '').trim(),
  contactEmail: (env.VITE_CONTACT_EMAIL ?? '').trim(),
  baseUrl: env.BASE_URL,
}

export const isSignupConfigured = Boolean(config.functionUrl && config.publishableKey && config.turnstileSiteKey)

export const privacyHref = `${config.baseUrl}privacy/`
export const homeHref = config.baseUrl
