/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  readonly VITE_WAITLIST_FUNCTION_URL?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITE_CONTACT_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
