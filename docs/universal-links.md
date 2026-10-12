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
`src/lib/share.ts` builds share links as `${EXPO_PUBLIC_WEB_URL}${path}` for `/dish/<id>` and
`/restaurant/<id>`. For tapping one of those links to open the app instead of Safari:

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
   `/dish/*` and `/restaurant/*`. If the app starts sharing lists or profiles, add the path there
   and add a landing page here.
5. The Associated Domains capability must be enabled for the App ID in the Apple Developer portal,
   and the app rebuilt (`npx expo prebuild`, then a native rebuild): a Metro reload does not pick it up.

Only the real `com.forebytes.app` bundle id resolves; a developer build with a custom `IOS_BUNDLE_ID`
will not open from links unless it is added to the file too.

## Landing pages for people without the app

`/dish/[id]` and `/restaurant/[id]` (`components/ShareLanding.tsx`) are what a shared link shows in a
browser. They are `noindex`, are deliberately **not** in the sitemap, and 404 for anything that is not
a uuid. With the app installed iOS opens the app and never shows them.

They are generic ("Someone shared a dish with you"). Rich per-item previews (the dish name and photo
in the iMessage/WhatsApp card) need the page to read data, and `forebytes-app` keeps `dishes` and
`restaurants` behind sign-in (`anon` has no grant). Do **not** point this site at the anon key to get
around that. If the founders want rich cards, add one narrow server-side read through the service
role that returns only the public fields (name, restaurant name, cover photo), validated by uuid, and
set `generateMetadata` plus an Open Graph image from it. That is a data-exposure decision, so make it
deliberately, in the app's `AGENTS.md` threat model first.

## Canonical host

The site's canonical URL is the apex (`https://forebytes.com`, `lib/site.ts`), matching the in-app
links to `forebytes.com/privacy`, `/terms` and `/community-guidelines`. The `www` host serves the same
pages, and canonical tags keep search engines from treating it as duplicate content. Keep the
paths `/privacy`, `/terms`, `/community-guidelines` stable: the app links to them.
