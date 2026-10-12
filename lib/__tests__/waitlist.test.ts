import { describe, expect, it } from "vitest";
import { parseWaitlistBody } from "@/lib/waitlist";

describe("parseWaitlistBody", () => {
  it("accepts a valid email and normalises it", () => {
    expect(parseWaitlistBody({ email: "  Aoife@Example.COM " })).toEqual({ kind: "ok", email: "aoife@example.com" });
  });

  it.each(["", "nope", "a@b", "a b@c.com", "@x.com", 42, null, undefined])("rejects %j", (email) => {
    expect(parseWaitlistBody({ email }).kind).toBe("invalid");
  });

  it("rejects an email over 254 characters", () => {
    expect(parseWaitlistBody({ email: `${"a".repeat(250)}@x.com` }).kind).toBe("invalid");
  });

  it("treats a filled honeypot as a bot, even with a valid email", () => {
    expect(parseWaitlistBody({ email: "a@b.com", company: "Acme" })).toEqual({ kind: "bot" });
  });
});
