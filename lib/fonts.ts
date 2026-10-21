import { Caprasimo, Figtree, Inter, Playfair_Display } from "next/font/google";

export const caprasimo = Caprasimo({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--f-caprasimo",
});

export const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--f-figtree",
});

// The iOS app's own typefaces (Playfair Display for titles, Inter for everything dense). Used only
// inside the phone mockups, so they are not preloaded: the browser fetches them when a phone renders.
export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--f-playfair",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  variable: "--f-inter",
});
