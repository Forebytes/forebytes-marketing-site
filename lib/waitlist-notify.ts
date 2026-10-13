/**
 * Email the team when someone new joins the waitlist, through Brevo's transactional API.
 * Brevo is already a listed processor in the privacy policy, and forebytes.com is verified there.
 *
 * Optional: with no BREVO_API_KEY this does nothing. Failures throw so the caller can log them,
 * but the caller must never let a failed alert fail the signup.
 */
export async function notifyNewSignup(email: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) return;

  const to = (process.env.WAITLIST_NOTIFY_TO ?? "support@forebytes.com")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean)
    .map((address) => ({ email: address }));
  const from = process.env.WAITLIST_NOTIFY_FROM ?? "noreply@forebytes.com";

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Forebytes website", email: from },
      to,
      // The address was validated by parseWaitlistBody (no whitespace), so it is safe in a subject.
      subject: `New waitlist signup: ${email}`,
      textContent: `${email} just joined the Forebytes waitlist.\n\n${new Date().toISOString()}`,
    }),
  });
  if (!res.ok) throw new Error(`Brevo notification failed: ${res.status}`);
}
