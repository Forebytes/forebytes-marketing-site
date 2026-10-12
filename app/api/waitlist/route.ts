import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { parseWaitlistBody } from "@/lib/waitlist";

export const runtime = "nodejs";

/**
 * Waitlist signup. Persists to ./data/waitlist.jsonl locally.
 * For production, replace `store()` with Supabase: serverless hosts have a read-only filesystem,
 * so this only works for local development. See docs/deployment.md.
 */
async function store(entry: { email: string; at: string }) {
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "waitlist.jsonl"), JSON.stringify(entry) + "\n");
}

export async function POST(req: Request) {
  let body: { email?: unknown; company?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const result = parseWaitlistBody(body);
  // Pretend success to bots so they learn nothing.
  if (result.kind === "bot") return NextResponse.json({ ok: true });
  if (result.kind === "invalid") return NextResponse.json({ error: result.message }, { status: 422 });

  try {
    await store({ email: result.email, at: new Date().toISOString() });
  } catch {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
