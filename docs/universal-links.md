# Domains, share links and universal links

How `forebytes.com`, the demo, and the iOS app fit together, and what must not change. If you are
about to touch a domain, a redirect, a share path or the app's `associatedDomains`, read this first.

## What lives where

| Host | Served by | Notes |
| --- | --- | --- |
| `forebytes.com`, `www.forebytes.com` | **this site** (Vercel project `forebytes-marketing-site`) | Both serve directly. **Neither redirects.** |
| `<slug>.forebytes.com` (`anuskitchen`, `aperitivioatthecafe`, ...) | `forebytes-demo` Vercel project | One entry per restaurant. Printed QR codes point at `https://<slug>.forebytes.com/menu`. **Never remove or move these.** |
| `forebytes-demo.vercel.app` | `forebytes-demo` | The demo's own address. |
| `support@forebytes.com` | Zoho Mail (MX records on the domain) | Do not delete the MX, SPF or DKIM records when editing DNS. |

Adding a new restaurant to the demo means adding `<slug>.forebytes.com` to the **demo** project
only. Nothing in this repo changes.

## The universal-link contract with `forebytes-app`

`forebytes-app/app.config.ts` declares `associatedDomains: ['applinks:www.forebytes.com']`, and
`src/lib/share.ts` builds share links as `${EXPO_PUBLIC_WEB_URL}${path}` for `/dish/<id>`,
`/restaurant/<id>` and `/user/<id>`. For tapping one of those links to open the app instead of
Safari:

1. **The link's host must be `www.forebytes.com`.** Set `EXPO_PUBLIC_WEB_URL=https://www.forebytes.com`
   in the app. If it is set to the apex (`https://forebytes.com`), links will open in Safari, because
   the apex is not in `associatedDomains`. (Alternatively add `applinks:forebytes.com` to the app as
   well; this site serves the same file on both hosts.)
2. **`https://www.forebytes.com/.well-known/apple-app-site-association` must return 200 with JSON and no
   redirect.** Apple rejects redirects. So do not make `www` redirect to the apex, and do not add
   a Vercel redirect, a `redirects()` rule, or middleware that touches `/.well-known/*`.
3. **`APPLE_TEAM_ID` must be set in Vercel** (production). The file is built by `lib/aasa.ts`, served
   by `app/aasa/route.ts`, and reached through a rewrite in `next.config.ts`. Without a valid Team ID
   it returns 404 on purpose: a wrong file would be cached by Apple and break links silently.
4. **`lib/aasa.ts` `UNIVERSAL_LINK_PATHS` must match the paths the app shares.** Today
   `/dish/*`, `/restaurant/*` and `/user/*`. If the app starts sharing lists too, add the path
   there and add a landing page here.
5. The Associated Domains capability must be enabled for the App ID in the Apple Developer portal,
   and the app rebuilt (`npx expo prebuild`, then a native rebuild): a Metro reload does not pick it up.

Only the real `com.forebytes.app` bundle id resolves; a developer build with a custom `IOS_BUNDLE_ID`
will not open from links unless it is added to the file too.

## Landing pages for people without the app

`/dish/[id]`, `/restaurant/[id]` and `/user/[id]` (`components/ShareLanding.tsx`) are what a shared
link shows in a browser. They are `noindex`, are deliberately **not** in the sitemap, and 404 for
anything that is not a uuid. With the app installed iOS opens the app and never shows them.

They show the real dish, restaurant, or profile when one exists: name, photo, and (for a dish) its
restaurant's name, as both the on-page card and the Open Graph title/description/image for the
iMessage/WhatsApp preview. A profile shows regardless of whether the account is private, privacy
gates following and content, not identity, same as the app's own public profile screen. A hidden,
soft-deleted, or not-found id falls back to the original generic copy, same as before.

This reads through `public_dish_card()`, `public_restaurant_card()` and `public_profile_card()`
(`supabase/share-preview.sql`), three narrow `security definer` functions called from
`lib/sharePreview-server.ts` with the service role key, never the anon key, which `forebytes-app`
keeps `dishes`, `restaurants` and `profiles` behind sign-in from. Each function returns only the
public fields (name, restaurant name, cover photo, city, or username, display name, avatar), never
prices, allergens, nutrition, ratings, reviews, follower counts, or anything from follows or lists.
This was a deliberate data-exposure decision, recorded in `forebytes-app/docs/security.md`.

**Run `supabase/share-preview.sql`** in the shared Supabase project before this works in production,
same as `supabase/showcase.sql`. Until then, both loaders return null and every shared link falls
back to the generic landing page, nothing breaks, it just isn't rich yet.

## Canonical host

The site's canonical URL is the apex (`https://forebytes.com`, `lib/site.ts`), matching the in-app
links to `forebytes.com/privacy`, `/terms` and `/community-guidelines`. The `www` host serves the same
pages, and canonical tags keep search engines from treating it as duplicate content. Keep the
paths `/privacy`, `/terms`, `/community-guidelines` stable: the app links to them.
