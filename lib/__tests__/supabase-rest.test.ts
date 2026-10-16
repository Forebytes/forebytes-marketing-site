import { afterEach, describe, expect, it } from "vitest";
import { authHeaders, supabaseEnv } from "@/lib/supabase-rest";

const env = { ...process.env };
afterEach(() => {
  process.env = { ...env };
});

describe("authHeaders", () => {
  it("sends a legacy JWT key as apikey and Bearer", () => {
    expect(authHeaders("eyJabc.def.ghi")).toEqual({ apikey: "eyJabc.def.ghi", Authorization: "Bearer eyJabc.def.ghi" });
  });
  it("sends a new-style secret key in apikey only", () => {
    expect(authHeaders("sb_secret_x")).toEqual({ apikey: "sb_secret_x" });
  });
});

describe("supabaseEnv", () => {
  it("is null unless both values are set", () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    expect(supabaseEnv()).toBeNull();
    process.env.SUPABASE_URL = "https://x.supabase.co/";
    expect(supabaseEnv()).toBeNull();
    process.env.SUPABASE_SERVICE_ROLE_KEY = "k";
    expect(supabaseEnv()).toEqual({ url: "https://x.supabase.co", key: "k" });
  });
});
