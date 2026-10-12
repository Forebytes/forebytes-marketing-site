import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { SITE } from "@/lib/site";

/**
 * Every static app/**\/page.tsx is a public, indexable route. Dynamic share-landing pages
 * (/dish/[id], /restaurant/[id]) are noindex on purpose and are not in the sitemap.
 */
function pageRoutes(dir = "app", base = ""): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return name.startsWith("[") ? [] : pageRoutes(full, `${base}/${name}`);
    return name === "page.tsx" ? [base || "/"] : [];
  });
}

describe("sitemap", () => {
  const listed = sitemap().map((e) => e.url.replace(SITE.url, "") || "/");

  it("lists every public page, so a new page cannot ship unindexed", () => {
    for (const route of pageRoutes()) expect(listed, `${route} missing from app/sitemap.ts`).toContain(route);
  });

  it("lists nothing that is not a page", () => {
    const routes = pageRoutes();
    for (const url of listed) expect(routes, `${url} is in the sitemap but has no page`).toContain(url);
  });
});
