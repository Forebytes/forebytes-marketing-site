import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/** Per-page metadata: own title/description, canonical, and matching Open Graph/Twitter cards. */
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  const full = `${title} · ${SITE.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: path, siteName: SITE.name, locale: SITE.locale, type: "website" },
    twitter: { card: "summary_large_image", title: full, description },
  };
}
