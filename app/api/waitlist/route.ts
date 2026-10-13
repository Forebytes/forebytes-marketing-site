import { after, NextResponse } from "next/server";
import { createLimiter } from "@/lib/rate-limit";
import { notifyNewSignup } from "@/lib/waitlist-notify";
import { parseWaitlistBody } from "@/lib/waitlist";
import { storeWaitlistEmail } from "@/lib/waitlist-store";

export const runtime = "nodejs";

const allow = createLimiter({ max: 5, windowMs: 10 * 60 * 1000 });

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!allow(ip)) return NextResponse.json({ error: "Too many attempts. Please try again in a few minutes." }, { status: 429 });

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

  let isNew: boolean;
  try {
    isNew = await storeWaitlistEmail(result.email);
  } catch (error) {
    console.error("waitlist: could not store signup", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // Alert the team about genuinely new signups only. It runs after the response is sent, so the
  // visitor never waits on it, and a failed alert is logged but never fails the signup.
  if (isNew) {
    after(async () => {
      try {
        await notifyNewSignup(result.email);
      } catch (error) {
        console.error("waitlist: could not send the signup alert", error instanceof Error ? error.message : error);
      }
    });
  }
  return NextResponse.json({ ok: true });
}
