# Forebytes marketing site, agent guide

The public website for Forebytes (restaurant discovery + AR menus, launching in Dublin). Next.js 16
App Router, React 19, TypeScript, Tailwind v4, GSAP ScrollTrigger and Lenis. Deployed on Vercel.
The app itself lives in `forebytes-official/forebytes-app`; this repo is only the marketing site.

Read `README.md` for setup. This file is about how to work in the codebase.

> **If this conversation is about launching, going live, the domain, or Vercel, read "Before going
> live" below and raise the open blockers with the user before doing anything else.** Several are
> knowingly deferred and will not look broken.

---

## Non-negotiables

### Security

1. **Never put a secret behind `NEXT_PUBLIC_`.** That prefix inlines the value into the browser
   bundle. `NEXT_PUBLIC_SITE_URL` is the only one today.
2. **The Supabase service role key never appears in the repo or in client code.** It bypasses RLS.
   It lives in Vercel's environment variables and is read only in route handlers.
3. **Client components read only `NEXT_PUBLIC_` variables.** `npm run check:secrets` fails the build
   otherwise.
4. **Validate on the server.** `lib/waitlist.ts` is the control for the signup form; the form's
   `required` attribute is a convenience. Keep the honeypot field (`company`) and keep answering
   bots with a fake success so they learn nothing.
5. **When the waitlist moves to Supabase, follow the app's database rules** (`AGENTS.md` in
   `forebytes-app`): RLS on the table, `anon` gets nothing, writes go through the route handler with
   the service role, which needs its own grant because `service_role` bypasses RLS but not grants.
   The two founders share one Supabase project, so coordinate before running SQL.

`npm run check:secrets` and `npm run check:audit` run in CI. They are not style advice: a PR that
breaks one fails.

### Legal and claims

- **Privacy, Terms, Community Guidelines and FAQs are written by the founders from what the app
  actually does.** Do not rewrite, "improve" or soften them. Change them only when the user supplies
  new copy.
- **Do not invent facts.** No fabricated ratings, user counts, press, testimonials or launch
  claims. The design still carries a few placeholders (see below), which are the user's call.
- Privacy and Terms still need a solicitor's review, especially "Limitation of liability".

---

## Architecture

### Routes

`/` home, `/about`, `/faq`, `/community-guidelines`, `/privacy`, `/terms`, plus `POST /api/waitlist`,
`sitemap.xml`, `robots.txt`, `manifest.webmanifest` and a generated Open Graph image.

Long-form legal pages share `components/LegalPage.tsx`. Section bodies are JSX; use the
`.legal-prose` styles in `globals.css` (paragraphs, lists, `<h3>` for sub-items) rather than ad-hoc
markup. `components/legal.tsx` has the labelled-item helper.

### SEO is part of the definition of done

- **Every page exports `metadata` through `pageMeta()`** in `lib/seo.ts`. Do not set a bare `title`:
  a page without its own Open Graph card inherits the home page's, so shared links preview wrongly.
- **A new page goes in `app/sitemap.ts`.** `lib/__tests__/routes.test.ts` fails if a page is missing
  from the sitemap or the sitemap lists a page that does not exist.
- **One `<h1>` per page.**
- Structured data goes through `components/JsonLd.tsx`, which escapes `<`. Site-wide
  Organization/WebSite is in `app/layout.tsx`, MobileApplication on the home page, FAQPage on `/faq`.
  If a FAQ answer changes, change its `text` for the schema too.
- Canonical URLs come from `SITE.url` (`NEXT_PUBLIC_SITE_URL`). It defaults to `https://forebytes.com`.

### Design system ("Organic")

Cream and sand ground, terracotta accent, sage second accent. Caprasimo for headings, Figtree for
body, loaded with `next/font` (variables `--f-caprasimo`, `--f-figtree`).

- Tokens live in `app/globals.css` under `@theme static`. Component classes (`.btn`, `.tag`,
  `.input`) live in `app/organic.css` inside `@layer components` so Tailwind utilities can override
  them. Use `var(--color-*)` or the Tailwind colour utilities, not new hex values.
- Over-round everything: pill buttons, `--radius-lg` containers. Left-aligned, asymmetric layouts.
- **Section eyebrow pills ("The problem", "Scroll", "First stop") were removed on purpose.** Do not
  add them back. Everything else in the original design was kept deliberately, including the
  decorative circles, stickers, marquee and the tilting motion. Do not "clean it up".
- Use `h-dvh` / `min-h-dvh`, not `h-screen`, for full-height sections (mobile Safari).

### Responsive rules (checked at 320px to 2560px, portrait and landscape)

- **Size pinned scenes by viewport height as well as width**: `clamp(min, min(Nvw, Mdvh), max)`.
  A landscape phone is 390px tall, so a heading sized only in `vw` hides under the nav.
- **Keep sticky scenes clear of the fixed nav** (`pt-[72px]`) and use `h-dvh`, not `h-screen`.
- **Content is bounded to a ~1680px column.** `--gutter` grows on wide screens, so use `.px-page` or
  `var(--gutter)` for side padding rather than a fixed clamp, or content sprawls left on a 2560px display.
- **The Story phone is a fixed 320x650 device scaled with `--s`** (computed in `Story.tsx`), so its screens
  always look like the app. Size it by changing the fit maths, never by resizing the device.
- **Do not tilt tall blocks.** A 1.5deg rotation on a 1500px-tall legal section swings its edges off screen.
  Use `Reveal variant="fade"` for anything taller than a paragraph.
- **Never put a display utility on a link that is also `hidden`** (`inline-flex` overrides `hidden`). Use
  `hidden md:inline-flex`.
- **Clip full-bleed rotated bands** (the marquee) in an `overflow-x-clip` wrapper so phones cannot pan sideways.
- Tap targets are at least 32px tall; check with a real device or the responsive audit before shipping.
- **Links into the pinned scenes jump, they do not scroll.** Lenis runs with `anchors: { immediate: true }`,
  and `#how`, `#ar` and `#join` are `SceneAnchor` markers inside their scenes, placed where the scene's content
  is visible. A link to a scene's own top would land on a blank first frame. Add the same marker to any new
  pinned scene that gets a nav link.

### Motion

- Scroll scenes are client components using GSAP `ScrollTrigger` through `useGSAP`; Lenis drives
  smooth scrolling from GSAP's ticker (`components/SmoothScroll.tsx`) so the two stay in sync.
- Pinned scenes use a tall section with a `sticky` child and compute progress from the section, then
  apply it with `gsap.set`. Clean up through `useGSAP`'s scope, never raw listeners.
- `components/Reveal.tsx` is the scroll-in for everything else. It hides content until it enters the
  viewport, and shows it immediately for `prefers-reduced-motion`.
- Respect `prefers-reduced-motion`: no interval-driven or velocity-driven motion when it is set.

### Waitlist

`WaitlistForm` posts to `/api/waitlist`: honeypot, in-memory rate limit, server-side validation
(`lib/waitlist.ts`), then `lib/waitlist-store.ts`. Production writes to the Supabase `waitlist` table
through PostgREST with the service role key; local dev falls back to `data/waitlist.jsonl`. In
production with no Supabase configured it fails loudly (500) instead of losing signups. The table
SQL is `supabase/waitlist.sql`. A genuinely new signup (not a duplicate) also emails the team through
Brevo (`lib/waitlist-notify.ts`, optional via `BREVO_API_KEY`), sent with `after()` so the visitor
never waits and a failed alert never fails the signup. See `docs/deployment.md`.

### Domains and universal links (do not contradict the app)

`forebytes.com` and `www.forebytes.com` serve this site directly with **no redirect**. The demo's
`<slug>.forebytes.com` subdomains (QR codes on printed menus) belong to the demo project and must
never be moved. `forebytes-app` opens shared `/dish/<id>` and `/restaurant/<id>` links from
`www.forebytes.com`, so:

- **Never redirect `www`, or anything under `/.well-known/`.** Apple rejects redirects for the
  association file.
- `/.well-known/apple-app-site-association` is built by `lib/aasa.ts` from `APPLE_TEAM_ID` and must
  list the same paths the app shares (`UNIVERSAL_LINK_PATHS`).
- The app must set `EXPO_PUBLIC_WEB_URL=https://www.forebytes.com`, not the apex, or shared links
  open Safari instead of the app.
- `/privacy`, `/terms` and `/community-guidelines` are linked from inside the app. Keep the paths.
- `/dish/[id]` and `/restaurant/[id]` are noindex landing pages for people without the app.

Full detail, and what to check before changing any of it: `docs/universal-links.md`.

---

## Conventions

- **TypeScript strict.** No `any`. `npm run typecheck` must pass.
- **Path alias:** `@/` is the repo root.
- **Server components by default.** Add `"use client"` only for scroll scenes, forms and anything
  using hooks or the DOM.
- **Comments explain why, not what.** Prefer none over one that restates the code.
- **Tests:** vitest, under `**/__tests__/*.test.ts`. Pure logic goes in `lib/` so it can be tested
  (see `lib/waitlist.ts`). A bug fix gets a test that fails without it.
- **Dependencies:** TypeScript is pinned to 6.x because `typescript-eslint` does not support 7 yet.
  Check before bumping.
- **Port:** the dev server uses Next's default, 3000. Another project may already be on it; pass
  `-p` rather than editing `package.json`.

---

## Verifying your work

```sh
npm run verify   # typecheck, lint, tests, secret scan, dependency audit
npm run build    # what Vercel runs; catches bad metadata and prerender errors
```

CI runs the same checks plus a build and gitleaks, so a green `verify` plus a green `build` locally
means a green PR. A `pre-push` hook (installed by `npm install` via the `prepare` script) runs the
fast half, the secret scan and typecheck. `git push --no-verify` skips it if you must.

Work on a branch and open a PR into `main`.

---

## Before going live

Open items, none of which will look broken:

1. **Waitlist.** Live and working on Supabase. Optional: add `BREVO_API_KEY` in Vercel to get an email
   to support@forebytes.com for each new signup. Delete any test rows from the `waitlist` table.
2. **Privacy Policy entity.** `[FOREBYTES ENTITY NAME]` and `[REGISTERED ADDRESS]` are still
   placeholders in `app/privacy/page.tsx`. Forebytes is not incorporated yet.
3. **Solicitor review** of Privacy and Terms.
4. **"Launched" vs "launching" in Dublin.** The founders' copy says launched; the home page, footer
   and metadata still say launching. Ask which is true.
5. **Design placeholders still visible:** "YOUR DISH", "DISH MODEL GOES HERE", "Dish name /
   Nutrition / € —" menu rows, and the "4.8" and "AR ready" stickers (the 4.8 is not a real rating).
6. **BLOCKED on an Apple Developer account.** There is no Apple Team ID yet, so
   `/.well-known/apple-app-site-association` returns 404 and shared links open the website, not the
   app. Nothing on the site is broken by this. When the team exists: set `APPLE_TEAM_ID` in Vercel,
   redeploy, check the file returns 200 JSON on `www.forebytes.com`, then do the app-side steps in
   `docs/universal-links.md`. Tracked in the repo's issues.
7. **Domain.** `forebytes.com` is live. Set `NEXT_PUBLIC_SITE_URL=https://forebytes.com` in Vercel.
   Add `APPLE_TEAM_ID` for universal links, and set `EXPO_PUBLIC_WEB_URL=https://www.forebytes.com` in
   the app (see "Domains and universal links").
8. **After launch:** add the site to Google Search Console and submit `/sitemap.xml`.
9. The `anthropics/claude-code-action` workflows used in `forebytes-app` (`claude.yml`,
   `claude-code-review.yml`) are not set up here yet; they need the `CLAUDE_CODE_OAUTH_TOKEN` secret.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
