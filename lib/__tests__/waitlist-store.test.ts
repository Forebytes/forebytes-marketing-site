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
  it("inserts through PostgREST, ignores duplicates, and reports a new signup", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => [{ id: "1" }] });
    vi.stubGlobal("fetch", fetchMock);
    expect(await storeWaitlistEmail("a@b.com")).toBe(true);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://x.supabase.co/rest/v1/waitlist?on_conflict=email");
    expect(init.headers.Prefer).toContain("ignore-duplicates");
    expect(init.headers.Prefer).toContain("return=representation");
    expect(JSON.parse(init.body)).toEqual({ email: "a@b.com" });
  });

  it("reports a duplicate (no row returned) as not new", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => [] }));
    expect(await storeWaitlistEmail("a@b.com")).toBe(false);
  });

  it("sends a new-style sb_secret key in apikey only, not as a Bearer token", async () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "sb_secret_abc123";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => [{ id: "1" }] });
    vi.stubGlobal("fetch", fetchMock);
    await storeWaitlistEmail("a@b.com");
    const { headers } = fetchMock.mock.calls[0][1];
    expect(headers.apikey).toBe("sb_secret_abc123");
    expect(headers.Authorization).toBeUndefined();
  });

  it("sends a legacy JWT service_role key as both apikey and Bearer", async () => {
    process.env.SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOi.payload.sig";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => [{ id: "1" }] });
    vi.stubGlobal("fetch", fetchMock);
    await storeWaitlistEmail("a@b.com");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer eyJhbGciOi.payload.sig");
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
