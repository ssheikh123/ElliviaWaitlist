-- Retire the original 4-argument signup function now that the join-waitlist
-- Edge Function calls public.waitlist_join_v2() (which requires first/last name).
-- Apply ONLY after the updated Edge Function is deployed. Idempotent.
drop function if exists public.waitlist_join(text, text, text, text);
