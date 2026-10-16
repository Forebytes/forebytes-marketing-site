# Live phones

The phones on the home page are not images. They are the Forebytes iOS app's own screens, rebuilt in
code with the app's colours, fonts and layouts, and filled with real data picked for each visitor.

## What the visitor sees

| Where | Screen | Data |
| --- | --- | --- |
| Hero | Dish detail | The featured dish, its restaurant, rating, nutrition, "AR model ready" |
| Story 01 | Discover | A drawn map, pins and cards for restaurants near the visitor, titled "Near <their city>" |
| Story 02 | Restaurant (Menu tab) | The featured restaurant and its menu |
| Story 03 | Dish detail | The featured dish (an AR dish when one exists) |
| Story 04 | Rate this dish | The app's rating card, filled in as a sample |
| Story 05 | Feed | Sample friends rating the featured dish |

The "4.8" sticker in the hero is now the featured restaurant's real average rating, or absent when it has none.

## How it works

```
visitor -> /api/showcase  (Vercel IP location headers)
              |
              +-> loadShowcaseRows()  -> Supabase RPC site_showcase()   (cached 5 min per instance)
              +-> buildShowcase(rows, geo)   pure logic in lib/showcase.ts
          <- one coherent story: featured restaurant, dish, nearby cards
```

- `components/app-ui/ShowcaseProvider.tsx` fetches once, after the page is on screen, so the page stays static
  and fast. Every phone reads the same data through `useScreenData()`.
- **Selection** (`buildShowcase`, tested in `lib/__tests__/showcase.test.ts`): among restaurants within 50 km of
  the visitor that have a menu, feature the highest rated (ties at random). Prefer an AR dish at that
  restaurant, else an AR dish nearby, else its best dish. If nothing with a menu is near the visitor (today
  the data is Ireland), any restaurant with a menu stands in. Cards are measured from the visitor, or from the
  featured restaurant in the fallback, so they read as a believable neighbourhood.
- The title says the **visitor's city** ("Near New York") even when the restaurants are elsewhere. That is a
  deliberate product decision: the map will work everywhere once Mapbox is live.

## States

- **Loading:** dynamic text is a quiet same-size block (`[data-skeleton] [data-t]` in `globals.css`); the real
  app chrome (tab bar, tabs, buttons) is already visible. Layout never shifts.
- **Ready:** real data.
- **Empty** (no database configured, the function missing, or no restaurant has a menu): the same screens with
  plain placeholder labels ("Dish name", "Restaurant name"). Never invented venues.
- **Local dev with no Supabase credentials:** a clearly labelled sample (`SAMPLE` in `lib/showcase-server.ts`)
  so the phones can be worked on. It is never served in production.

## What is exposed, and what is not

`supabase/showcase.sql` defines `site_showcase()`. It returns, for restaurants that have a menu, ratings or are
demo data: name, cuisines, city, country, coordinates, price level, average rating and rating count; and for
their dishes: name, description, price, category, nutrition, allergens, diet flags, whether an AR model is
ready, average rating and rating count. **No user ids, usernames, review text, photos or `created_by`.** It is
`security definer` and executable only by `service_role`; the browser never sees the key.

The decision to expose this, and why it is acceptable, is recorded in `forebytes-app`'s `docs/security.md`.
Do not widen it (more columns, review text, photos) without updating that record and asking the founders.

## Rules for working on the phones

1. **They mirror the app.** `components/app-ui/theme.ts` copies the app's light theme, type scale and radii, and
   `screens.tsx` copies its layouts. When the app's design changes, change these to match. Check against
   `forebytes-app` (`src/theme/index.ts`, `src/features/restaurants/*`, `src/app/dish/[id]`, `src/app/(tabs)/feed.tsx`).
2. **Screens are drawn at 390 x 819** and scaled by `AppScreen` to whatever phone they sit in. Do not add
   responsive CSS inside a screen.
3. **No real people.** The Feed's friends are generated (`components/app-ui/sample.ts`): invented names, generic
   comments, chosen from the dish so they do not flicker. Never show real users' names, avatars or reviews on a
   public page.
4. **Demo data is labelled.** Seeded restaurants (`isDemo`) carry the same DEMO badge the app shows, because the
   seed is explicitly fabricated test data.
5. **Dynamic text goes through `<Txt>`** so it becomes a skeleton block while loading.
6. The phones are `aria-hidden` and `data-nosnippet`: decorative, and not page content for search engines.

## Testing

- `npm test` covers the selection logic, including the New York fallback and the AR-dish preferences.
- To see a richer dataset locally, intercept `/api/showcase` in Playwright and return your own JSON in the
  `Showcase` shape (`lib/showcase.ts`). Do not add invented venues to the repo.
- To see the empty and loading states, run `next start` with no Supabase variables, or delay the route.
