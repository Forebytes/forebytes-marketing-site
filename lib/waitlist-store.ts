import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

/**
 * Save a waitlist email. A duplicate counts as success, so the form never reveals who is on the list.
 *
 * Production writes to Supabase through PostgREST with the service role key (server only, never a
 * NEXT_PUBLIC_ variable). Local development falls back to ./data/waitlist.jsonl so the form works
 * with no setup. In production with no Supabase configured it throws rather than silently losing signups.
 */
export async function storeWaitlistEmail(email: string): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/waitlist?on_conflict=email`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=ignore-duplicates,return=minimal",
      },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error(`Supabase waitlist insert failed: ${res.status}`);
    return;
  }

  if (process.env.NODE_ENV === "production") throw new Error("Waitlist storage is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");

  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "waitlist.jsonl"), JSON.stringify({ email, at: new Date().toISOString() }) + "\n");
}
