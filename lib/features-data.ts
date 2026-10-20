/** Shared between the /features page (server, for the ItemList schema) and FeaturesList (client,
 * for the scrollspy layout) — plain data only, so it crosses the server/client boundary cleanly. */
export type FeatureIcon = "location" | "pricetag" | "star" | "cube" | "people" | "bookmark";

export type Feature = {
  id: string;
  t: string;
  h: string;
  b: string;
  icon: FeatureIcon;
  bg: string;
  dot: string;
  fg: string;
};

export const FEATURES: Feature[] = [
  {
    id: "discover",
    t: "Discover",
    h: "A live map, not a list.",
    b: "Search and filter Dublin's restaurants by distance, cuisine and dietary need, on an actual map rather than a scroll of cards. Pins update as you move it.",
    icon: "location",
    bg: "bg-accent-2-300",
    dot: "bg-accent-2-700 text-bg",
    fg: "",
  },
  {
    id: "menus",
    t: "Menus",
    h: "Prices and nutrition, up front.",
    b: "Every dish shows its price and, where it's been added, calories, protein, carbs and fat before you order, not after. Menus are kept current by the people who've actually eaten there, not scanned from a PDF once and left to rot.",
    icon: "pricetag",
    bg: "bg-accent",
    dot: "bg-accent-900",
    fg: "text-bg",
  },
  {
    id: "ratings",
    t: "Ratings",
    h: "The dish is rated, not just the restaurant.",
    b: "A restaurant can be a 4.5 while the one dish you're about to order is a 2. Forebytes rates both separately, so \"great restaurant\" and \"order this\" are two different, honest answers.",
    icon: "star",
    bg: "bg-accent-200",
    dot: "bg-accent text-bg",
    fg: "",
  },
  {
    id: "ar",
    t: "AR",
    h: "Real 3D scans, not stock renders.",
    b: "On a LiDAR iPhone, a seated sweep builds a metric-accurate 3D model of the actual dish, on the device, from frames that are deleted the moment the model is built: nothing but the finished scan ever leaves the phone. On any other iPhone, a few guided photos go through an AI check that confirms the photo actually matches the dish before anything is built from it. Every model, from either path, is reviewed in AR on a real table before it goes live, and is labelled Real size or Approximate depending on how it was made. No invented placeholder ever ships as if it were a real scan.",
    icon: "cube",
    bg: "bg-accent-2-700",
    dot: "bg-accent-2-300 text-bg",
    fg: "text-bg",
  },
  {
    id: "feed",
    t: "Feed",
    h: "What people you follow actually ate.",
    b: "Follow people whose taste you trust and see what they rated, where, and what they'd order again. A recommendation from someone you know beats an anonymous average.",
    icon: "people",
    bg: "bg-accent-2-300",
    dot: "bg-accent-2-700 text-bg",
    fg: "",
  },
  {
    id: "lists",
    t: "Lists",
    h: "Keep track without a group chat.",
    b: "Saved for Later, Want to Try, Places Visited, and lists of your own: the place to put a recommendation the moment you get it, instead of losing it three scrolls up a conversation.",
    icon: "bookmark",
    bg: "bg-bg",
    dot: "bg-accent-300",
    fg: "",
  },
];
