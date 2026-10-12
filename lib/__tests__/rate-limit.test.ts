import { describe, expect, it } from "vitest";
import { createLimiter } from "@/lib/rate-limit";

describe("createLimiter", () => {
  it("allows up to max, then blocks, then recovers after the window", () => {
    let t = 0;
    const allow = createLimiter({ max: 2, windowMs: 1000, now: () => t });
    expect([allow("a"), allow("a"), allow("a")]).toEqual([true, true, false]);
    expect(allow("b")).toBe(true); // separate key
    t = 1001;
    expect(allow("a")).toBe(true);
  });
});
