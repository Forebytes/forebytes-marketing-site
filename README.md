# Forebytes marketing site

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · next/font

## Run
    npm install
    npm run dev      # http://localhost:4173 (dev)
    npm run build && npm start

## Structure
- `app/` — routes: `/`, `/about`, `/privacy`, `/terms`, `/api/waitlist`, sitemap, robots
- `app/globals.css` — Organic design tokens (colours, fonts, radii, shadows)
- `app/organic.css` — Organic component classes (`.btn`, `.tag`, `.input`…) ported from the design system
- `components/home/` — scroll-driven home sections (Hero, Marquee, Manifesto, Story, ArReveal, Features, Dublin, Cta)
- `components/` — Nav, Footer, Reveal, LegalPage, WaitlistForm, SmoothScroll

## Waitlist
`POST /api/waitlist` validates the email (with a honeypot) and appends to `data/waitlist.jsonl`.
Serverless hosts have a read-only filesystem, so swap `store()` in `app/api/waitlist/route.ts` for
Supabase / Resend / Loops before deploying. Set `NEXT_PUBLIC_SITE_URL` for correct OG/sitemap URLs.
