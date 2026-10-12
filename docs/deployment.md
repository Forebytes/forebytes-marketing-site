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

## Waitlist storage (required before launch)

`app/api/waitlist/route.ts` currently writes to `data/waitlist.jsonl`. Vercel's filesystem is
read-only, so on the live site every signup would return an error.

Move `store()` to Supabase, following the rules in `forebytes-app`'s `AGENTS.md`:

- A `waitlist` table with a unique, lower-cased `email`, `created_at`, and RLS enabled.
- **No grant to `anon` or `authenticated`.** Only the server writes to it.
- The route handler uses the **service role key**, which needs an explicit grant on the table
  (`service_role` bypasses RLS but not grants).
- Rate-limit the route, and treat a duplicate email as success so the form does not reveal who is
  already on the list.
- The service role key goes in Vercel as a server-only variable. Never prefix it with `NEXT_PUBLIC_`.
- Both founders share one Supabase project: coordinate before running SQL against it.

Put the table's SQL in `supabase/` in this repo, or in the app's `schema.sql`, whichever the team
prefers, so it is re-runnable.

## After launch

- Add the site as a property in Google Search Console and submit `https://<domain>/sitemap.xml`.
- Check a shared link in a preview tool (Slack, iMessage, LinkedIn) to confirm the Open Graph card.
- Validate structured data with Google's Rich Results Test on `/` and `/faq`.
