import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storeWaitlistEmail } from "@/lib/waitlist-store";

const env = { ...process.env };
beforeEach(() => {
  process.env.SUPABASE_URL = "https://x.supabase.co/";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-key";
});
afterEach(() => {
  process.env = { ...env };
  vi.unstubAllGlobals();
});

describe("storeWaitlistEmail", () => {
  it("inserts through PostgREST and ignores duplicates", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);
    await storeWaitlistEmail("a@b.com");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://x.supabase.co/rest/v1/waitlist?on_conflict=email");
    expect(init.headers.Prefer).toContain("ignore-duplicates");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(JSON.parse(init.body)).toEqual({ email: "a@b.com" });
  });

  it("throws when Supabase rejects the insert", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 401 }));
    await expect(storeWaitlistEmail("a@b.com")).rejects.toThrow("401");
  });

  it("refuses to lose signups in production when storage is not configured", async () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    vi.stubEnv("NODE_ENV", "production");
    await expect(storeWaitlistEmail("a@b.com")).rejects.toThrow("not configured");
  });
});
