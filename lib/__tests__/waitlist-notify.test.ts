import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { notifyNewSignup } from "@/lib/waitlist-notify";

const env = { ...process.env };
beforeEach(() => {
  delete process.env.BREVO_API_KEY;
  delete process.env.WAITLIST_NOTIFY_TO;
  delete process.env.WAITLIST_NOTIFY_FROM;
});
afterEach(() => {
  process.env = { ...env };
  vi.unstubAllGlobals();
});

describe("notifyNewSignup", () => {
  it("does nothing when Brevo is not configured", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await notifyNewSignup("a@b.com");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("emails support@forebytes.com by default, with the address in the subject", async () => {
    process.env.BREVO_API_KEY = "brevo-key";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);
    await notifyNewSignup("aoife@example.com");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(init.headers["api-key"]).toBe("brevo-key");
    const body = JSON.parse(init.body);
    expect(body.to).toEqual([{ email: "support@forebytes.com" }]);
    expect(body.sender.email).toBe("noreply@forebytes.com");
    expect(body.subject).toBe("New waitlist signup: aoife@example.com");
    expect(body.textContent).toContain("aoife@example.com");
  });

  it("supports several recipients and a custom sender", async () => {
    process.env.BREVO_API_KEY = "k";
    process.env.WAITLIST_NOTIFY_TO = "a@x.com, b@x.com ,";
    process.env.WAITLIST_NOTIFY_FROM = "site@forebytes.com";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);
    await notifyNewSignup("c@d.com");
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.to).toEqual([{ email: "a@x.com" }, { email: "b@x.com" }]);
    expect(body.sender.email).toBe("site@forebytes.com");
  });

  it("throws when Brevo rejects the request, so the caller can log it", async () => {
    process.env.BREVO_API_KEY = "k";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    await expect(notifyNewSignup("a@b.com")).rejects.toThrow("401");
  });
});
