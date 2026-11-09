-- Database security & integrity tests for public.waitlist.
-- Runs entirely inside a transaction that is ROLLED BACK: it leaves no data behind.
-- Run in the Supabase SQL Editor, or:  psql "$DATABASE_URL" -f supabase/tests/waitlist_db.test.sql
-- Any failed expectation raises an exception and aborts the script.

begin;

do $$
declare
  v_hash  text := repeat('a', 64);
  v_hash2 text := repeat('b', 64);
  v_res   text;
  v_count int;
  i       int;
begin
  -- 1. Normalization trigger + database-level uniqueness
  insert into public.waitlist (email, consent_at, consent_version)
  values ('  Test.Unique@Example.COM ', now(), 'test');
  select count(*) into v_count from public.waitlist where email = 'test.unique@example.com';
  if v_count <> 1 then raise exception 'FAIL normalization: expected stored lower-case email'; end if;

  begin
    insert into public.waitlist (email, consent_at, consent_version) values ('test.unique@example.com', now(), 'test');
    raise exception 'FAIL uniqueness: duplicate insert succeeded';
  exception when unique_violation then null; end;

  begin
    insert into public.waitlist (email, consent_at, consent_version) values ('TEST.UNIQUE@example.com', now(), 'test');
    raise exception 'FAIL uniqueness: case-variant duplicate insert succeeded';
  exception when unique_violation then null; end;

  -- 2. Constraints
  begin
    insert into public.waitlist (email, consent_at, consent_version) values ('not-an-email', now(), 'test');
    raise exception 'FAIL email format constraint';
  exception when check_violation then null; end;

  begin
    insert into public.waitlist (email, referral_source, consent_at, consent_version)
    values ('ref.test@example.com', '<script>', now(), 'test');
    raise exception 'FAIL referral constraint';
  exception when check_violation then null; end;

  begin
    insert into public.waitlist (email, consent_version) values ('noconsent@example.com', 'test');
    raise exception 'FAIL consent_at must be required';
  exception when not_null_violation then null; end;

  -- 3. waitlist_join: duplicates are a silent, identical success
  v_res := public.waitlist_join('Join.Test@Example.com', 'instagram', 'test-v1', v_hash);
  if v_res <> 'ok' then raise exception 'FAIL join first: %', v_res; end if;
  v_res := public.waitlist_join('join.test@example.com', 'qr-flyer', 'test-v1', v_hash);
  if v_res <> 'ok' then raise exception 'FAIL join duplicate should be ok: %', v_res; end if;
  select count(*) into v_count from public.waitlist where email = 'join.test@example.com';
  if v_count <> 1 then raise exception 'FAIL join duplicate created % rows', v_count; end if;
  -- original referral is preserved, not overwritten by the second attempt
  perform 1 from public.waitlist where email = 'join.test@example.com' and referral_source = 'instagram';
  if not found then raise exception 'FAIL original referral overwritten'; end if;

  begin
    perform public.waitlist_join('x@example.com', null, 'v', 'not-a-hash');
    raise exception 'FAIL bad client hash accepted';
  exception when invalid_parameter_value then null; end;

  -- 4. Rate limit: 10 per 10 minutes per client hash (2 used above)
  for i in 1..8 loop
    v_res := public.waitlist_join(format('rl%s@example.com', i), null, 'test-v1', v_hash);
    if v_res <> 'ok' then raise exception 'FAIL rate limit tripped early at %', i; end if;
  end loop;
  v_res := public.waitlist_join('rl-over@example.com', null, 'test-v1', v_hash);
  if v_res <> 'rate_limited' then raise exception 'FAIL rate limit not enforced: %', v_res; end if;
  perform 1 from public.waitlist where email = 'rl-over@example.com';
  if found then raise exception 'FAIL rate-limited signup was stored'; end if;
  -- a different client is unaffected
  v_res := public.waitlist_join('other.client@example.com', null, 'test-v1', v_hash2);
  if v_res <> 'ok' then raise exception 'FAIL other client blocked: %', v_res; end if;

  raise notice 'integrity tests passed';
end $$;

-- 5. Privilege tests: anon / authenticated / service_role cannot touch the table directly
do $$
declare
  r text;
begin
  foreach r in array array['anon', 'authenticated', 'service_role'] loop
    execute format('set local role %I', r);

    begin
      perform 1 from public.waitlist limit 1;
      raise exception 'FAIL % can SELECT waitlist', r;
    exception when insufficient_privilege then null; end;

    begin
      insert into public.waitlist (email, consent_at, consent_version) values ('role.test@example.com', now(), 'x');
      raise exception 'FAIL % can INSERT waitlist', r;
    exception when insufficient_privilege then null; end;

    begin
      update public.waitlist set referral_source = 'direct';
      raise exception 'FAIL % can UPDATE waitlist', r;
    exception when insufficient_privilege then null; end;

    begin
      delete from public.waitlist;
      raise exception 'FAIL % can DELETE waitlist', r;
    exception when insufficient_privilege then null; end;

    begin
      perform 1 from private.waitlist_rate_limits limit 1;
      raise exception 'FAIL % can read rate limits', r;
    exception when insufficient_privilege then null; end;

    if r in ('anon', 'authenticated') then
      begin
        perform public.waitlist_join('role.test@example.com', null, 'x', repeat('c', 64));
        raise exception 'FAIL % can EXECUTE waitlist_join', r;
      exception when insufficient_privilege then null; end;
    else
      if public.waitlist_join('svc.test@example.com', 'direct', 'x', repeat('d', 64)) <> 'ok' then
        raise exception 'FAIL service_role cannot use waitlist_join';
      end if;
    end if;

    reset role;
  end loop;
  raise notice 'privilege tests passed';
end $$;

select 'ALL WAITLIST DB TESTS PASSED' as result;

rollback;

-- ---------------------------------------------------------------------------
-- waitlist_join_v2 (first/last name). Also rolled back.
-- ---------------------------------------------------------------------------
begin;
do $$
declare v text;
begin
  v := public.waitlist_join_v2('Names.Test@Example.com', '  Maria ', ' O''Brien-López ', 'instagram', 'v2', repeat('e',64));
  if v <> 'ok' then raise exception 'FAIL v2 ok: %', v; end if;
  perform 1 from public.waitlist where email='names.test@example.com' and first_name='Maria' and last_name='O''Brien-López';
  if not found then raise exception 'FAIL names not stored/trimmed'; end if;
  v := public.waitlist_join_v2('names.test@example.com', 'Other', 'Person', null, 'v2', repeat('e',64));
  perform 1 from public.waitlist where email='names.test@example.com' and first_name='Maria';
  if not found then raise exception 'FAIL duplicate overwrote names'; end if;
  begin perform public.waitlist_join_v2('x1@example.com', '', 'Smith', null, 'v2', repeat('e',64)); raise exception 'FAIL empty first accepted';
  exception when invalid_parameter_value then null; end;
  begin perform public.waitlist_join_v2('x3@example.com', '<b>Ann', 'Smith', null, 'v2', repeat('e',64)); raise exception 'FAIL markup accepted';
  exception when check_violation then null; end;
  set local role anon;
  begin perform public.waitlist_join_v2('x4@example.com','A','B',null,'v2',repeat('f',64)); raise exception 'FAIL anon can execute v2';
  exception when insufficient_privilege then null; end;
  reset role;
end $$;
select 'V2 DB TESTS PASSED' as result;
rollback;
