export const SITE = {
  name: "Forebytes",
  // Set NEXT_PUBLIC_SITE_URL in Vercel to the real production domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://forebytes.com").replace(/\/$/, ""),
  tagline: "See it before you bite it.",
  description:
    "Forebytes is a restaurant and dish discovery app for Dublin: a live map, menus with prices and nutrition, ratings for individual dishes (not just restaurants), and AR models built from real food scans you can place on your own table before you order.",
  locale: "en_IE",
  emails: { support: "support@forebytes.com" },
} as const;
