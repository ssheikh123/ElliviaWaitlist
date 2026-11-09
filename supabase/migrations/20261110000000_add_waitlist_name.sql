-- =============================================================================
-- Single "name" field (replaces first_name + last_name). Step 1 of 2: additive.
--
-- * Adds a nullable `name` column and public.waitlist_join_v3(), which requires
--   a name. Nothing existing changes, so the currently deployed Edge Function
--   keeps working until the new one is deployed.
-- * Step 2 (20261110000100_merge_names_drop_first_last.sql) copies
--   first_name + ' ' + last_name into `name` and removes the old columns.
-- Idempotent.
-- =============================================================================

alter table public.waitlist add column if not exists name text;

alter table public.waitlist drop constraint if exists waitlist_name_format;
alter table public.waitlist add constraint waitlist_name_format check (
  name is null
  or (char_length(name) between 1 and 161
      and name = btrim(name)
      and name !~ '[[:cntrl:]<>@0-9]')
);

revoke all on table public.waitlist from public, anon, authenticated, service_role;

create or replace function public.waitlist_join_v3(
  p_email           text,
  p_name            text,
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
  v_name        text := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
  v_last_10_min integer;
  v_last_24_h   integer;
  v_global_hour integer;
begin
  if p_client_hash is null or p_client_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid client hash' using errcode = '22023';
  end if;
  if v_name = '' then
    raise exception 'name is required' using errcode = '22023';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('waitlist:' || p_client_hash, 0));

  select
    count(*) filter (where created_at > now() - interval '10 minutes'),
    count(*)
  into v_last_10_min, v_last_24_h
  from private.waitlist_rate_limits
  where client_hash = p_client_hash
    and created_at > now() - interval '24 hours';

  if v_last_10_min >= 10 or v_last_24_h >= 50 then
    return 'rate_limited';
  end if;

  select count(*) into v_global_hour
  from private.waitlist_rate_limits
  where created_at > now() - interval '1 hour';

  if v_global_hour >= 1000 then
    return 'rate_limited';
  end if;

  insert into private.waitlist_rate_limits (client_hash) values (p_client_hash);

  insert into public.waitlist (email, name, referral_source, consent_at, consent_version)
  values (v_email, v_name, p_referral_source, now(), p_consent_version)
  on conflict (email) do nothing;   -- duplicates are a silent success; existing rows are never changed

  return 'ok';
end;
$$;

comment on function public.waitlist_join_v3(text, text, text, text, text) is
  'Rate-limited, idempotent waitlist insert with a single name. Executable only by service_role (the join-waitlist Edge Function).';

revoke all on function public.waitlist_join_v3(text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.waitlist_join_v3(text, text, text, text, text) to service_role;
