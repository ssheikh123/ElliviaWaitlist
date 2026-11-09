// Supabase Edge Function: join-waitlist
// Public (anonymous) endpoint. verify_jwt is disabled in supabase/config.toml because
// the new sb_publishable_ keys are not JWTs. Every protection is enforced in code:
// origin allowlist, publishable-key check, strict input validation, server-side
// Cloudflare Turnstile verification, and database-backed rate limiting.
import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2'
import { createHandler, parseKeyDictionary, parseList } from './handler.ts'
import { verifyTurnstileToken } from './turnstile.ts'

const DEFAULT_ALLOWED_ORIGINS = 'https://ssheikh123.github.io'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const secretKeys = parseKeyDictionary(Deno.env.get('SUPABASE_SECRET_KEYS'))
// Prefer the new secret key system; fall back to the legacy key only if a project lacks new keys.
const secretKey = secretKeys['default'] ?? Object.values(secretKeys)[0] ?? Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
const publishableKeys = Object.values(parseKeyDictionary(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')))
const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY') ?? ''
const allowedOrigins = parseList(Deno.env.get('ALLOWED_ORIGINS') ?? DEFAULT_ALLOWED_ORIGINS)
const allowedHostnames = allowedOrigins.map((o) => {
  try {
    return new URL(o).hostname
  } catch {
    return ''
  }
}).filter(Boolean)

let admin: SupabaseClient | null = null
function getAdmin(): SupabaseClient {
  if (!supabaseUrl || !secretKey) throw Object.assign(new Error('missing server credentials'), { code: 'config' })
  admin ??= createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })
  return admin
}

const handler = createHandler({
  allowedOrigins,
  publishableKeys,
  hashSecret: Deno.env.get('RATE_LIMIT_SALT') || turnstileSecret,
  verifyTurnstile: (token, remoteIp, idempotencyKey) =>
    verifyTurnstileToken({ secret: turnstileSecret, token, remoteIp, allowedHostnames, idempotencyKey }),
  joinWaitlist: async ({ email, firstName, lastName, referralSource, consentVersion, clientHash }) => {
    const { data, error } = await getAdmin().rpc('waitlist_join_v2', {
      p_email: email,
      p_first_name: firstName,
      p_last_name: lastName,
      p_referral_source: referralSource,
      p_consent_version: consentVersion,
      p_client_hash: clientHash,
    })
    if (error) throw { code: error.code ?? 'rpc_error' } // never forward error.message/details: may contain personal data
    return data === 'rate_limited' ? 'rate_limited' : 'ok'
  },
  // Logs contain event names and error codes only: no names, emails, IPs, tokens, or keys.
  logError: (event, meta) => console.error(JSON.stringify({ event, ...meta })),
})

Deno.serve(handler)
