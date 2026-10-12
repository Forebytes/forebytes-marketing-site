export const SITE = {
  name: "Forebytes",
  // Set NEXT_PUBLIC_SITE_URL in Vercel to the real production domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://forebytes.com").replace(/\/$/, ""),
  tagline: "See it before you bite it.",
  description:
    "Forebytes is a restaurant discovery app for Dublin. Find restaurants nearby, browse menus with prices and nutrition, and see dishes in AR on your own table before you order.",
  locale: "en_IE",
  emails: { support: "support@forebytes.com" },
} as const;
