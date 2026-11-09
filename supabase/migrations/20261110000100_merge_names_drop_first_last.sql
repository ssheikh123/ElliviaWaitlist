-- =============================================================================
-- Single "name" field. Step 2 of 2. Apply ONLY after the Edge Function that
-- calls public.waitlist_join_v3() is deployed.
--
-- 1. Copy first_name + ' ' + last_name into `name` for rows that have either,
--    without touching rows whose `name` is already set or whose names are blank.
-- 2. Remove first_name / last_name (and their checks) and waitlist_join_v2().
-- Runs in one transaction; aborts (changing nothing) if any non-blank name
-- would be lost.
-- =============================================================================

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'waitlist' and column_name = 'first_name'
  ) then
    update public.waitlist
    set name = nullif(btrim(concat_ws(' ', nullif(btrim(first_name), ''), nullif(btrim(last_name), ''))), '')
    where name is null
      and (nullif(btrim(first_name), '') is not null or nullif(btrim(last_name), '') is not null);

    if exists (
      select 1 from public.waitlist
      where name is null
        and (nullif(btrim(first_name), '') is not null or nullif(btrim(last_name), '') is not null)
    ) then
      raise exception 'aborting: some first/last names were not copied into name';
    end if;

    alter table public.waitlist drop constraint if exists waitlist_first_name_format;
    alter table public.waitlist drop constraint if exists waitlist_last_name_format;
    alter table public.waitlist drop column first_name;
    alter table public.waitlist drop column last_name;
  end if;
end $$;

drop function if exists public.waitlist_join_v2(text, text, text, text, text, text);
