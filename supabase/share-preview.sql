-- Rich link previews for shared dish/restaurant/profile links. Re-runnable.
-- Run in the Supabase SQL Editor (shared project: coordinate first, and see
-- the decision recorded in forebytes-app/docs/security.md).
--
-- WHAT THIS EXPOSES, deliberately and only this: for a dish, its name, photo,
-- and its restaurant's name. For a restaurant, its name, photo, and city.
-- For a profile, its username, display name, and avatar, the same as any
-- signed-in user can already see in the app, private accounts included
-- (privacy gates following and content, not identity, see
-- forebytes-app/AGENTS.md's "Before shipping to production"). Nothing else:
-- no prices, allergens, nutrition, ratings, reviews, follower counts, follows
-- or lists.
--
-- A hidden or soft-deleted dish, or a profile that does not exist, returns
-- no row, same as the app shows nobody. All three functions are `security
-- definer` (they read tables the public cannot) and are therefore callable
-- ONLY by service_role: revoked from public, anon and authenticated. The
-- marketing site calls them from a server route with the service role key;
-- the browser never sees that key.

create or replace function public.public_dish_card(p_id uuid)
returns table (name text, photo_url text, restaurant_name text)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select d.name, d.photo_url, r.name as restaurant_name
  from public.dishes d
  join public.restaurants r on r.id = d.restaurant_id
  where d.id = p_id
    and d.deleted_at is null
    and d.is_hidden = false;
$$;

create or replace function public.public_restaurant_card(p_id uuid)
returns table (name text, photo_url text, city text)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select r.name, r.photo_url, r.city
  from public.restaurants r
  where r.id = p_id;
$$;

create or replace function public.public_profile_card(p_id uuid)
returns table (username text, display_name text, avatar_url text)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select p.username, p.display_name, p.avatar_url
  from public.profiles p
  where p.id = p_id;
$$;

revoke all on function public.public_dish_card(uuid) from public, anon, authenticated;
grant execute on function public.public_dish_card(uuid) to service_role;

revoke all on function public.public_restaurant_card(uuid) from public, anon, authenticated;
grant execute on function public.public_restaurant_card(uuid) to service_role;

revoke all on function public.public_profile_card(uuid) from public, anon, authenticated;
grant execute on function public.public_profile_card(uuid) to service_role;
