import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { authHeaders, supabaseEnv } from "@/lib/supabase-rest";

/**
 * Save a waitlist email. A duplicate counts as success, so the form never reveals who is on the list.
 * Resolves to true if the email was new, false if it was already on the list (used to alert only once).
 *
 * Production writes to Supabase through PostgREST with the service role key (server only, never a
 * NEXT_PUBLIC_ variable). Local development falls back to ./data/waitlist.jsonl so the form works
 * with no setup. In production with no Supabase configured it throws rather than silently losing signups.
 */
export async function storeWaitlistEmail(email: string): Promise<boolean> {
  const env = supabaseEnv();

  if (env) {
    const res = await fetch(`${env.url}/rest/v1/waitlist?on_conflict=email`, {
      method: "POST",
      headers: {
        ...authHeaders(env.key),
        "Content-Type": "application/json",
        // return=representation: an inserted row comes back, an ignored duplicate comes back as [].
        Prefer: "resolution=ignore-duplicates,return=representation",
      },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error(`Supabase waitlist insert failed: ${res.status}`);
    const rows: unknown = await res.json();
    return Array.isArray(rows) && rows.length > 0;
  }

  if (process.env.NODE_ENV === "production") throw new Error("Waitlist storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");

  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "waitlist.jsonl"), JSON.stringify({ email, at: new Date().toISOString() }) + "\n");
  return true;
}
