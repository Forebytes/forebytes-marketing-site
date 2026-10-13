# Deployment

The site deploys to Vercel from `main`. Every push to a branch gets a preview URL.

## First deploy

1. In Vercel: **Add New → Project**, import this repository. Vercel needs access to the
   `forebytes-official` GitHub organisation; authorise it when prompted.
2. Framework preset is detected as Next.js. No build settings need changing.
3. Add environment variables (Project → Settings → Environment Variables):

   | Variable | Value | Notes |
   | --- | --- | --- |
   | `NEXT_PUBLIC_SITE_URL` | `https://<production domain>` | No trailing slash |
   | Supabase variables | see "Waitlist storage" | Server-side only |

4. Add the production domain (Project → Settings → Domains) and set `NEXT_PUBLIC_SITE_URL` to match.

## Waitlist storage (required: the live form returns a 500 until this is done)

The code is written (`lib/waitlist-store.ts`, `app/api/waitlist/route.ts`). In production it writes
to a Supabase `waitlist` table, and fails loudly if Supabase is not configured rather than losing
signups. Vercel's filesystem is read-only, so the local-file fallback only works in development.

1. **Create the table.** Run `supabase/waitlist.sql` in the Supabase SQL Editor. It is re-runnable.
   Both founders share one Supabase project: coordinate before running SQL against it. It follows the
   app's rules: RLS on, no grant to `anon` or `authenticated`, an explicit grant to `service_role`
   (which bypasses RLS but not grants), and the email rules mirrored as a CHECK constraint.
2. **Add two env vars in Vercel** (Production, and Preview if you want previews to work):
   - `SUPABASE_URL`: the project URL (Supabase dashboard → Project Settings → API).
   - `SUPABASE_SERVICE_ROLE_KEY`: the secret key from the same page (the `service_role` key, or an
     `sb_secret_...` key under API Keys; both work). **Server-only. Never prefix it with
     `NEXT_PUBLIC_`, never commit it.** `npm run check:secrets` fails the build if you do.
3. **Redeploy** (env vars only apply to new deployments).
4. **Test:** submit a real email on the live site, confirm the row appears in Supabase, and submit
   it again to confirm a duplicate still shows success.
5. **Signup alerts (optional but recommended).** Add `BREVO_API_KEY` in Vercel (Brevo → SMTP & API →
   API Keys → Generate). Each genuinely new signup then emails `support@forebytes.com`. Repeat
   signups of the same address stay silent, and a failed email never fails the signup (it is logged
   in Vercel's function logs). Optional overrides: `WAITLIST_NOTIFY_TO` (comma-separated recipients)
   and `WAITLIST_NOTIFY_FROM` (a sender on the verified `forebytes.com` domain, default
   `noreply@forebytes.com`). Redeploy after adding them.
6. **Rate limiting:** the route has a best-effort in-memory limiter, which is per serverless
   instance and not a guarantee. Add a Vercel Firewall rule (Project → Firewall → Rate limiting) on
   `POST /api/waitlist`, for example 10 requests per minute per IP.

## After launch

- Add the site as a property in Google Search Console and submit `https://<domain>/sitemap.xml`.
- Check a shared link in a preview tool (Slack, iMessage, LinkedIn) to confirm the Open Graph card.
- Validate structured data with Google's Rich Results Test on `/` and `/faq`.
