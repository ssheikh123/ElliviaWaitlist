-- =============================================================================
-- Add first and last name to the waitlist.
--
-- * Columns are NULLABLE so existing signups keep blank names (the team fills
--   them in manually). New signups must provide both: public.waitlist_join_v2()
--   rejects empty names, and the Edge Function validates them before calling it.
-- * Additive and idempotent. The original 4-argument waitlist_join() is left in
--   place until the updated Edge Function is deployed; a follow-up migration
--   removes it.
-- =============================================================================

alter table public.waitlist
  add column if not exists first_name text,
  add column if not exists last_name  text;

alter table public.waitlist drop constraint if exists waitlist_first_name_format;
alter table public.waitlist add constraint waitlist_first_name_format check (
  first_name is null
  or (char_length(first_name) between 1 and 80
      and first_name = btrim(first_name)
      and first_name !~ '[[:cntrl:]<>@0-9]')
);

alter table public.waitlist drop constraint if exists waitlist_last_name_format;
alter table public.waitlist add constraint waitlist_last_name_format check (
  last_name is null
  or (char_length(last_name) between 1 and 80
      and last_name = btrim(last_name)
      and last_name !~ '[[:cntrl:]<>@0-9]')
);

-- New columns inherit the table's revoked privileges; reassert for clarity.
revoke all on table public.waitlist from public, anon, authenticated, service_role;

create or replace function public.waitlist_join_v2(
  p_email           text,
  p_first_name      text,
  p_last_name       text,
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
  v_first       text := btrim(p_first_name);
  v_last        text := btrim(p_last_name);
  v_last_10_min integer;
  v_last_24_h   integer;
  v_global_hour integer;
begin
  if p_client_hash is null or p_client_hash !~ '^[a-f0-9]{64}$' then
    raise exception 'invalid client hash' using errcode = '22023';
  end if;
  if coalesce(v_first, '') = '' or coalesce(v_last, '') = '' then
    raise exception 'first and last name are required' using errcode = '22023';
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

  insert into public.waitlist (email, first_name, last_name, referral_source, consent_at, consent_version)
  values (v_email, v_first, v_last, p_referral_source, now(), p_consent_version)
  on conflict (email) do nothing;   -- duplicates are a silent success; existing rows are never changed

  return 'ok';
end;
$$;

comment on function public.waitlist_join_v2(text, text, text, text, text, text) is
  'Rate-limited, idempotent waitlist insert with first/last name. Executable only by service_role (the join-waitlist Edge Function).';

revoke all on function public.waitlist_join_v2(text, text, text, text, text, text) from public, anon, authenticated;
grant execute on function public.waitlist_join_v2(text, text, text, text, text, text) to service_role;
