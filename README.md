# Forebytes marketing site

The public website for Forebytes: restaurant discovery and AR menu visualisation, launching in Dublin.

> **See it before you bite it.**

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP ScrollTrigger · Lenis · `next/font`

---

## 1. What you need installed

| Tool | Why | Install |
| --- | --- | --- |
| **Node 20.9+** | Runs Next.js | `brew install node` |
| **npm** | Package manager (the lockfile is npm's) | ships with Node |

```sh
node --version   # v20.9 or higher
```

## 2. First-time setup

```sh
git clone <repo-url>
cd forebytes-marketing-site
npm install        # also wires up the pre-push hook
cp .env.example .env.local
npm run dev        # http://localhost:3000
```

If port 3000 is busy: `npx next dev -p 4173`.

### Environment variables

| Variable | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `.env.local`, Vercel | Production domain. Used for canonical URLs, the sitemap, Open Graph and structured data. Defaults to `https://forebytes.com`. |
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Vercel (server-only) | Waitlist storage. Not needed locally: dev writes `data/waitlist.jsonl`. |
| `BREVO_API_KEY`, `WAITLIST_NOTIFY_TO`, `WAITLIST_NOTIFY_FROM` | Vercel (server-only), optional | Emails the team on each new waitlist signup. `WAITLIST_NOTIFY_TO` defaults to `support@forebytes.com`. |
| `APPLE_TEAM_ID` | Vercel (server-only) | Serves `/.well-known/apple-app-site-association` for universal links. 404s without it, on purpose. |

`NEXT_PUBLIC_` values are inlined into the browser bundle, so only ever put public values behind
that prefix. `.env*` files are gitignored; `.env.example` is the template.

## 3. Everyday commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and server (what Vercel runs) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (Next + TypeScript rules) |
| `npm test` | vitest |
| `npm run check:secrets` | Fails if a secret could reach the browser or a key is committed |
| `npm run check:audit` | Dependency audit gate: high/critical only, with a dated exception list |
| `npm run verify` | All of the above except build. This is what CI runs. |

## 4. Where things live

```
app/                    routes: / /about /faq /community-guidelines /privacy /terms, api/waitlist,
                        sitemap, robots, manifest, generated OG image
app/globals.css         design tokens (colours, fonts, radii, shadows) + shared utilities
app/organic.css         "Organic" component classes (.btn, .tag, .input)
components/home/        scroll-driven home sections (Hero, Marquee, Manifesto, Story, ArReveal,
                        Features, Dublin, Cta)
components/             Nav, Footer, Reveal, LegalPage, WaitlistForm, SmoothScroll, JsonLd
lib/                    site config, SEO helper, waitlist validation, GSAP helpers (+ __tests__)
scripts/                check-secrets, check-audit
docs/                   deployment, universal links and domains, live phones
```

### Design system

"Organic": cream and sand ground, terracotta accent, sage second accent, Caprasimo over Figtree,
pill buttons and over-rounded containers. Tokens are in `app/globals.css`; take colours from
`var(--color-*)` or the Tailwind utilities rather than new hex values.

### SEO

Every page sets metadata through `pageMeta()` (`lib/seo.ts`) so it gets its own title, canonical URL
and share card. New pages must be added to `app/sitemap.ts`; a test enforces it. Structured data
(Organization, WebSite, MobileApplication, FAQPage) goes through `components/JsonLd.tsx`.

### Waitlist

`POST /api/waitlist` validates the email (`lib/waitlist.ts`), has a honeypot and a rate limit, and
stores it in Supabase in production (`supabase/waitlist.sql`) or `data/waitlist.jsonl` in dev. See
`docs/deployment.md`.

### Domains and universal links

`forebytes.com` and `www` serve this site with no redirect; the demo's `<slug>.forebytes.com`
subdomains stay on the demo project. The iOS app opens shared `/dish/<id>` and `/restaurant/<id>` links
from `www.forebytes.com`, which needs the association file this site serves. Read
`docs/universal-links.md` before touching a domain, redirect or share path.

## 5. Security rules

1. Never put a secret behind `NEXT_PUBLIC_`.
2. The Supabase service role key never goes in the repo or in client code.
3. Validate on the server; client validation is a convenience.

`npm run check:secrets` enforces the first two, and CI also runs gitleaks over the full history.
Details in `AGENTS.md`.

## 6. Deployment

Vercel, from `main`. See `docs/deployment.md` for the steps, environment variables and post-launch
checklist.

## 7. Status

Before this goes live:

- [ ] Waitlist table created and Supabase env vars set in Vercel (code is done)
- [ ] **Blocked: no Apple Developer account / Team ID yet.** Then: `APPLE_TEAM_ID` in Vercel, and the app's `EXPO_PUBLIC_WEB_URL` set to `https://www.forebytes.com` (universal links)
- [ ] Privacy Policy entity name and registered address filled in
- [ ] Solicitor review of Privacy and Terms
- [ ] "Launched" vs "launching" in Dublin made consistent
- [ ] Design placeholders replaced (dish artwork, AR model, menu rows, stickers)
- [x] `forebytes.com` live on Vercel (apex and www, no redirect)
- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel
- [ ] Added to Google Search Console, sitemap submitted
