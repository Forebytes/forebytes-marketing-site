-- Marketing-site waitlist. Re-runnable. Run in the Supabase SQL Editor (shared project: coordinate first).
--
-- Follows forebytes-app's rules: RLS on, anon and authenticated get nothing, and the server-only
-- service role is granted explicitly, because service_role bypasses RLS but not grants.

create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  created_at timestamptz not null default now()
);

-- Mirror the route's validation as constraints: the route is a convenience, the database decides.
alter table public.waitlist drop constraint if exists waitlist_email_format;
alter table public.waitlist add constraint waitlist_email_format
  check (length(email) <= 254 and email = lower(email) and email ~ '^[^\s@]+@[^\s@]+\.[^\s@]{2,}$');

-- Unique on email so a repeat signup is ignored by `on_conflict=email`.
create unique index if not exists waitlist_email_key on public.waitlist (email);

alter table public.waitlist enable row level security;
-- No policies on purpose: with RLS on and no policy, no client role can read or write a row.

revoke all on public.waitlist from public, anon, authenticated;
grant select, insert on public.waitlist to service_role;
