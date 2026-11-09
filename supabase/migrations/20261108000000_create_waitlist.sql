-- =============================================================================
-- Ellivia prelaunch waitlist
--
-- Security model
--   * public.waitlist has RLS enabled with NO policies, and every table privilege
--     is revoked from anon, authenticated AND service_role. Nobody can read or
--     write it through the Data API, not even with a secret key.
--   * The only write path is public.waitlist_join(), a SECURITY DEFINER function
--     that only service_role may execute. The join-waitlist Edge Function calls it
--     after validating input and verifying Cloudflare Turnstile.
--   * waitlist_join() also enforces rate limits using salted HMAC hashes of the
--     client IP (never the raw IP), which pg_cron deletes after 24 hours.
--   * Project owners read/export signups through the Supabase Dashboard
--     (Table Editor / SQL Editor), which connects as the postgres role.
--
-- Idempotent: safe to re-run. Nothing here drops or rewrites existing data.
-- =============================================================================

create schema if not exists private;
revoke all on schema private from public, anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Waitlist table
-- -----------------------------------------------------------------------------
create table if not exists public.waitlist (
  id              uuid        primary key default gen_random_uuid(),
  email           text        not null,
  created_at      timestamptz not null default now(),
  referral_source text,
  consent_at      timestamptz not null,
  consent_version text        not null,

  constraint waitlist_email_key unique (email),
  constraint waitlist_email_normalized check (email = lower(btrim(email))),
  constraint waitlist_email_format check (
    char_length(email) between 6 and 254
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[a-z]{2,63}$'
  ),
  constraint waitlist_referral_source_format check (
    referral_source is null
    or referral_source ~ '^[a-z0-9]([a-z0-9-]{0,38}[a-z0-9])?$'
  ),
  constraint waitlist_consent_version_format check (char_length(consent_version) between 1 and 64)
);

comment on table public.waitlist is
  'Ellivia prelaunch waitlist. Email addresses only, used solely for launch notifications. Written exclusively via public.waitlist_join().';

-- Normalize on the way in as a defence in depth (the Edge Function already does).
create or replace function private.waitlist_normalize_email()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.email := lower(btrim(new.email));
  return new;
end;
$$;

drop trigger if exists waitlist_normalize_email on public.waitlist;
create trigger waitlist_normalize_email
  before insert or update of email on public.waitlist
  for each row execute function private.waitlist_normalize_email();

alter table public.waitlist enable row level security;
-- Deliberately no policies: with RLS on and no policies, API roles see nothing.
revoke all on table public.waitlist from public, anon, authenticated, service_role;

create index if not exists waitlist_created_at_idx on public.waitlist (created_at);

-- -----------------------------------------------------------------------------
-- Rate limiting (private schema: not exposed through the Data API)
-- -----------------------------------------------------------------------------
create table if not exists private.waitlist_rate_limits (
  id          bigint generated always as identity primary key,
  client_hash text        not null check (client_hash ~ '^[a-f0-9]{64}$'),
  created_at  timestamptz not null default now()
);

alter table private.waitlist_rate_limits enable row level security;
revoke all on table private.waitlist_rate_limits from public, anon, authenticated, service_role;

create index if not exists waitlist_rate_limits_client_idx
  on private.waitlist_rate_limits (client_hash, created_at desc);
create index if not exists waitlist_rate_limits_created_idx
  on private.waitlist_rate_limits (created_at);

-- -----------------------------------------------------------------------------
-- The single, narrowly-scoped write path
-- Returns 'ok' (inserted OR already present; deliberately indistinguishable)
-- or 'rate_limited'.
-- -----------------------------------------------------------------------------
create or replace function public.waitlist_join(
  p_email           text,
  p_referral_source text,
  p_consent_version text,
  p_client_hash     text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email       text := lower(btrim(p_email));
  v_last_10_min integer;
  v_last_24_h   integer;
  v_global_hour integer;
begin
  if p_client_hash is null or p_client_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid client hash' using errcode = '22023';
  end if;

  -- Serialize concurrent attempts from the same client so counts are exact.
  perform pg_advisory_xact_lock(hashtextextended('waitlist:' || p_client_hash, 0));

  select
    count(*) filter (where created_at > now() - interval '10 minutes'),
    count(*)
  into v_last_10_min, v_last_24_h
  from private.waitlist_rate_limits
  where client_hash = p_client_hash
    and created_at > now() - interval '24 hours';

  -- Generous per-connection limits: many people can share one IP
  -- (venue Wi-Fi when a QR flyer is scanned, mobile carrier NAT).
  if v_last_10_min >= 10 or v_last_24_h >= 50 then
    return 'rate_limited';
  end if;

  -- Global circuit breaker against a distributed flood.
  select count(*) into v_global_hour
  from private.waitlist_rate_limits
  where created_at > now() - interval '1 hour';

  if v_global_hour >= 1000 then
    return 'rate_limited';
  end if;

  insert into private.waitlist_rate_limits (client_hash) values (p_client_hash);

  insert into public.waitlist (email, referral_source, consent_at, consent_version)
  values (v_email, p_referral_source, now(), p_consent_version)
  on conflict (email) do nothing;   -- duplicates are a silent success

  return 'ok';
end;
$$;

comment on function public.waitlist_join(text, text, text, text) is
  'Rate-limited, idempotent waitlist insert. Executable only by service_role (the join-waitlist Edge Function).';

revoke all on function public.waitlist_join(text, text, text, text) from public, anon, authenticated;
grant execute on function public.waitlist_join(text, text, text, text) to service_role;

-- Lock down the trigger helper too.
revoke all on function private.waitlist_normalize_email() from public, anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- Hourly cleanup: rate-limit hashes are kept for at most ~24-25 hours.
-- cron.schedule() with a job name upserts, so re-running is safe.
-- -----------------------------------------------------------------------------
create extension if not exists pg_cron;

select cron.schedule(
  'waitlist-rate-limit-cleanup',
  '17 * * * *',
  $$delete from private.waitlist_rate_limits where created_at < now() - interval '24 hours'$$
);
