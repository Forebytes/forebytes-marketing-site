import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: SITE.description,
    start_url: "/",
    display: "browser",
    background_color: "#f5ead8",
    theme_color: "#f5ead8",
    icons: [{ src: "/icon.png", sizes: "256x256", type: "image/png" }],
  };
}
