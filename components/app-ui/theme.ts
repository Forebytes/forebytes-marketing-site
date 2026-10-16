import type { CSSProperties } from "react";

/**
 * The Forebytes iOS app's design tokens (forebytes-app src/theme/index.ts, light scheme), so the
 * phones on the site are the app's own palette, type and radii rather than the website's.
 * If the app's theme changes, change this file to match.
 */
export const c = {
  background: "#FAF7F2",
  surface: "#F2EBE0",
  surfaceRaised: "#FFFFFF",
  border: "#E5DACA",
  text: "#1F1813",
  textMuted: "#7D6E5D",
  textInverse: "#FFFFFF",
  primary: "#A67B4A",
  primaryPressed: "#8A6339",
  primarySoft: "#F0E4D2",
  accent: "#6B4E32",
  star: "#C9A227",
  danger: "#A6402F",
  success: "#4F7A4C",
  overlay: "rgba(31, 24, 19, 0.55)",
} as const;

export const radius = { sm: 6, md: 10, lg: 16, xl: 22, pill: 999 } as const;

export const SERIF = 'var(--f-playfair), "Playfair Display", Georgia, serif';
export const SANS = 'var(--f-inter), Inter, system-ui, -apple-system, sans-serif';

const serif = (weight: number, size: number, line: number, ls = 0): CSSProperties => ({
  fontFamily: SERIF, fontWeight: weight, fontSize: size, lineHeight: `${line}px`, letterSpacing: ls,
});
const sans = (weight: number, size: number, line: number, ls = 0): CSSProperties => ({
  fontFamily: SANS, fontWeight: weight, fontSize: size, lineHeight: `${line}px`, letterSpacing: ls,
});

/** Mirrors `typography` in the app's theme. */
export const t = {
  title: serif(700, 28, 32, -0.5),
  heading: serif(600, 21, 26, -0.3),
  dishName: serif(600, 17, 22, -0.2),
  subheading: sans(600, 15, 21),
  body: sans(400, 15, 22),
  caption: sans(400, 13, 18, 0.1),
  captionMedium: sans(500, 13, 18, 0.1),
  overline: { ...sans(600, 11, 14, 1.2), textTransform: "uppercase" } as CSSProperties,
  button: sans(600, 16, 22),
};

export const clamp = (lines: number): CSSProperties => ({
  display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical", overflow: "hidden",
});

export function formatPrice(cents: number | null, currency: string): string | null {
  if (cents == null) return null;
  return new Intl.NumberFormat("en-IE", { style: "currency", currency, maximumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
}

export const formatCuisine = (s: string) => s.replace(/[_-]+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

export const formatDistance = (m: number) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);

/** The design size every screen is drawn at: an iPhone 15 viewport, trimmed to the device's aspect. */
export const SCREEN_W = 390;
export const SCREEN_H = 819;
