const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type WaitlistResult =
  | { kind: "ok"; email: string }
  | { kind: "bot" }
  | { kind: "invalid"; message: string };

/**
 * Validate a waitlist submission. Kept apart from the route so it is testable.
 * The honeypot field ("company") is hidden from people; anything that fills it is a bot.
 */
export function parseWaitlistBody(body: { email?: unknown; company?: unknown }): WaitlistResult {
  if (typeof body.company === "string" && body.company.length > 0) return { kind: "bot" };
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return { kind: "invalid", message: "Please enter a valid email address." };
  }
  return { kind: "ok", email };
}
