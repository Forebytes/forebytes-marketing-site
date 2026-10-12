import { describe, expect, it } from "vitest";
import { isShareId } from "@/lib/share";

describe("isShareId", () => {
  it("accepts a uuid", () => expect(isShareId("3f2b8c1e-9a4d-4c7e-8b21-5d6f7a8b9c0d")).toBe(true));
  it.each(["", "dish", "123", "../etc/passwd", "3f2b8c1e-9a4d-4c7e-8b21-5d6f7a8b9c0d/x", "3f2b8c1e9a4d4c7e8b215d6f7a8b9c0d"])("rejects %j", (id) => expect(isShareId(id)).toBe(false));
});
