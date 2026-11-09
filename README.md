# Ellivia waitlist

Prelaunch waitlist website for **Ellivia**, a free iOS app (planned for December 2026) that helps insured
families explore hospital financial assistance. Built through Everyone Can Code Chicago's App Accelerator.
Ellivia is independent and not affiliated with RUSH University Medical Center.

**Live site:** https://ssheikh123.github.io/ElliviaWaitlist/

## Architecture

```
iPhone / browser
   │  static HTML/JS/CSS (GitHub Pages, built by GitHub Actions)
   │
   ├── Cloudflare Turnstile widget ──► token
   │
   └── POST {email, consent, turnstileToken, referralSource}
          │  apikey: sb_publishable_...   Origin: https://ssheikh123.github.io
          ▼
   Supabase Edge Function  join-waitlist   (verify_jwt = false; checks done in code)
     1. origin allowlist (CORS)          4. Turnstile Siteverify (server-side, secret key)
     2. publishable-key check            5. HMAC-hash the client IP
     3. size / JSON / email / consent    6. rpc waitlist_join() with SUPABASE_SECRET_KEYS
          ▼
   Postgres  public.waitlist_join()  SECURITY DEFINER, executable by service_role only
     • rate limits (10 / 10 min and 50 / day per connection, 1000 / hour globally)
     • INSERT … ON CONFLICT (email) DO NOTHING  → duplicates look identical to new signups
   Postgres  public.waitlist  RLS on, no policies, all API-role privileges revoked
```

The website is fully static. The only server-side code is the Edge Function.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html`, `privacy/index.html`, `404.html` | Page entry points (multi-page Vite build) |
| `src/components/` | Nav, hero, sections, footer, `SignupForm`, `TurnstileWidget`, CSS phone preview |
| `src/lib/` | `waitlistApi.ts` (fetch + error messages), `referral.ts` (first-touch `?ref=`), `turnstile.ts` (loader) |
| `src/PrivacyPage.tsx` | Privacy policy |
| `supabase/functions/_shared/waitlist-rules.ts` | Email/referral validation shared by browser **and** server |
| `supabase/functions/join-waitlist/` | `index.ts` (Deno entry), `handler.ts` (logic), `turnstile.ts` (Siteverify) |
| `supabase/migrations/` | Database schema, RLS, grants, rate limiting, pg_cron cleanup |
| `supabase/tests/waitlist_db.test.sql` | Database tests (run in a transaction, rolled back) |
| `tests/functions/` | Edge Function unit tests (Vitest, Node) |
| `.github/workflows/deploy.yml` | Build, test, deploy to GitHub Pages on push to `main` |

## Configuration

### Public build variables (safe to expose)

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://rjmtferugizqsxaqxkds.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | your `sb_publishable_...` key |
| `VITE_WAITLIST_FUNCTION_URL` | `https://rjmtferugizqsxaqxkds.supabase.co/functions/v1/join-waitlist` |
| `VITE_TURNSTILE_SITE_KEY` | your Turnstile **site** key (`0x...`) |
| `VITE_CONTACT_EMAIL` | optional public contact address (footer + privacy policy) |

* **Locally:** `.env.local` (git-ignored). Copy from `.env.example`.
* **GitHub Actions:** repository **Variables** (not Secrets, since they're public anyway):
  *Settings → Secrets and variables → Actions → Variables tab → New repository variable.*

Never put `sb_secret_...` or the Turnstile secret in any `VITE_` variable. The deploy workflow refuses
to publish if a secret-looking value appears in the build output.

### Edge Function secrets (server only)

Supabase Dashboard → **Edge Functions → Secrets**:

| Secret | Required | Notes |
| --- | --- | --- |
| `TURNSTILE_SECRET_KEY` | yes | Cloudflare Turnstile secret key |
| `ALLOWED_ORIGINS` | no | Comma-separated. Defaults to `https://ssheikh123.github.io`. Add a custom domain here if you get one. |
| `RATE_LIMIT_SALT` | no | Random string used to hash IPs. Defaults to a value derived from the Turnstile secret. |

`SUPABASE_URL`, `SUPABASE_SECRET_KEYS` and `SUPABASE_PUBLISHABLE_KEYS` are injected by Supabase automatically.

## Development

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit + component tests
npm run typecheck
npm run build        # typecheck + production build into dist/
```

For local UI work, use Cloudflare's test site key `1x00000000000000000000AA`. The deployed function
only accepts requests from the production origin, so local submissions are refused by CORS (by design).
To test signups end-to-end locally, run the function locally with the Supabase CLI and
`supabase/functions/.env.example` (copied to `supabase/functions/.env`):

```bash
npx supabase functions serve join-waitlist --env-file supabase/functions/.env
```

and point `VITE_WAITLIST_FUNCTION_URL` at `http://127.0.0.1:54321/functions/v1/join-waitlist`.

Live Turnstile checks against Cloudflare's dummy keys (needs network):

```bash
TURNSTILE_LIVE=1 npx vitest run tests/functions/turnstile.test.ts
```

## Deploying changes

* **Website:** push to `main`. GitHub Actions typechecks, tests, builds and deploys.
* **Edge Function:** `npx supabase functions deploy join-waitlist --project-ref rjmtferugizqsxaqxkds`
  (`verify_jwt = false` comes from `supabase/config.toml`).
* **Database:** `npx supabase db push` after `npx supabase link --project-ref rjmtferugizqsxaqxkds`.
  The migration is idempotent.

## Operating the waitlist

* **View / export signups:** Supabase Dashboard → Table Editor → `waitlist` → Export to CSV.
* **Signups by source:**
  ```sql
  select coalesce(referral_source, '(none)') as source, count(*) from public.waitlist group by 1 order by 2 desc;
  ```
* **Delete someone on request:**
  ```sql
  delete from public.waitlist where email = lower(trim('person@example.com'));
  ```
* **Referral links:** `https://ssheikh123.github.io/ElliviaWaitlist/?ref=instagram`
  (also `legal-council`, `womens-board`, `qr-flyer`, `direct`). Unknown slugs are stored as `other`.
  To add a new source, add it to `KNOWN_REFERRALS` in `supabase/functions/_shared/waitlist-rules.ts`
  and redeploy both the site and the function.
* If you change the consent wording, bump `CONSENT_VERSION` in the same file.
