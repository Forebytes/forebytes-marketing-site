import { describe, expect, it } from "vitest";
import { buildAasa, IOS_BUNDLE_ID, UNIVERSAL_LINK_PATHS } from "@/lib/aasa";

describe("buildAasa", () => {
  it("builds the association file for the app's bundle id and shared paths", () => {
    expect(buildAasa("ABCDE12345")).toEqual({
      applinks: {
        apps: [],
        details: [
          {
            appIDs: [`ABCDE12345.${IOS_BUNDLE_ID}`],
            components: [{ "/": "/dish/*" }, { "/": "/restaurant/*" }, { "/": "/user/*" }],
          },
        ],
      },
    });
  });

  it("covers every path the app shares", () => {
    expect(UNIVERSAL_LINK_PATHS).toEqual(["/dish/*", "/restaurant/*", "/user/*"]);
  });

  it.each([undefined, "", "abcde12345", "ABCDE1234", "ABCDE123456", "ABCDE-2345"])("returns null (404) for team id %j rather than serving a wrong file", (id) => {
    expect(buildAasa(id)).toBeNull();
  });
});
