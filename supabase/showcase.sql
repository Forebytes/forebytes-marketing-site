-- Public showcase for the marketing site's phones. Re-runnable. Run in the Supabase SQL Editor
-- (shared project: coordinate first, and record the decision in forebytes-app docs/security.md).
--
-- WHAT THIS EXPOSES, deliberately and only this: for restaurants that have a menu, ratings, or are
-- demo data: name, cuisines, city, country, coordinates, price level, average rating and rating
-- count; and for each of their dishes: name, description, price, category, nutrition, allergens,
-- diet flags, whether an AR model is ready, average rating and rating count.
--
-- WHAT IT DOES NOT: no user ids, no usernames, no review text, no photos, no `created_by`, no
-- anything from profiles, follows, lists or notifications. Averages and counts only.
--
-- The function is `security definer` (it reads tables the public cannot) and is therefore callable
-- ONLY by service_role: revoked from public, anon and authenticated. The marketing site calls it
-- from a server route with the service role key; the browser never sees that key.

create or replace function public.site_showcase()
returns jsonb
language sql
stable
security definer
set search_path = public, extensions
as $$
  select coalesce(jsonb_agg(r order by r."name"), '[]'::jsonb)
  from (
    select
      rest.id,
      rest.name,
      rest.cuisines,
      rest.city,
      rest.country,
      st_y(rest.location::geometry)                        as lat,
      st_x(rest.location::geometry)                        as lng,
      rest.price_level                                     as "priceLevel",
      rest.is_demo                                         as "isDemo",
      (select round(avg(rr.rating)::numeric, 1)
         from public.restaurant_ratings rr where rr.restaurant_id = rest.id)  as "ratingAvg",
      (select count(*)
         from public.restaurant_ratings rr where rr.restaurant_id = rest.id)  as "ratingCount",
      coalesce((
        select jsonb_agg(d order by d."category" nulls last, d."name")
        from (
          select
            dish.id,
            dish.name,
            dish.description,
            dish.price_cents                               as "priceCents",
            dish.currency,
            dish.category,
            dish.calories,
            dish.protein_g                                 as "proteinG",
            dish.carbs_g                                   as "carbsG",
            dish.fat_g                                     as "fatG",
            dish.allergens,
            dish.is_vegetarian                             as "isVegetarian",
            dish.is_vegan                                  as "isVegan",
            (dish.ar_model_status = 'ready' and dish.ar_model_url is not null) as "hasAr",
            (select round(avg(dr.rating)::numeric, 1)
               from public.dish_ratings dr where dr.dish_id = dish.id)          as "ratingAvg",
            (select count(*)
               from public.dish_ratings dr where dr.dish_id = dish.id)          as "ratingCount"
          from public.dishes dish
          where dish.restaurant_id = rest.id
            and dish.deleted_at is null
            and dish.is_hidden = false
          order by dish.category nulls last, dish.name
          limit 30
        ) d
      ), '[]'::jsonb)                                      as dishes
    from public.restaurants rest
    where rest.is_demo
       or exists (select 1 from public.dishes x
                   where x.restaurant_id = rest.id and x.deleted_at is null and x.is_hidden = false)
       or exists (select 1 from public.restaurant_ratings y where y.restaurant_id = rest.id)
    order by rest.name
    limit 300
  ) r;
$$;

revoke all on function public.site_showcase() from public, anon, authenticated;
grant execute on function public.site_showcase() to service_role;
