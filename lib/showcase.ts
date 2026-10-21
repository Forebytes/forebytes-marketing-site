/**
 * What the phones on the home page show. Raw rows come from the `site_showcase()` database function
 * (supabase/showcase.sql); `buildShowcase` turns them into one coherent story for one visitor.
 */

export type RawDish = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number | null;
  currency: string;
  category: string | null;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  allergens: string[];
  isVegetarian: boolean;
  isVegan: boolean;
  hasAr: boolean;
  ratingAvg: number | null;
  ratingCount: number;
};

export type RawRestaurant = {
  id: string;
  name: string;
  cuisines: string[];
  city: string | null;
  country: string | null;
  lat: number;
  lng: number;
  priceLevel: number | null;
  isDemo: boolean;
  ratingAvg: number | null;
  ratingCount: number;
  dishes: RawDish[];
};

export type Geo = { city?: string; country?: string; lat?: number; lng?: number };

export type Showcase = {
  /** The title shown on Discover: "Near <city>". The visitor's own city when we know it. */
  place: { city: string };
  /** Where the map is centred, and what the card distances are measured from. */
  centre: { lat: number; lng: number };
  /** Up to six restaurants, nearest first. */
  restaurants: Array<{ restaurant: RawRestaurant; distanceM: number }>;
  /** The restaurant shown in full: the highest rated nearby one that has a menu. */
  featured: RawRestaurant;
  /** The dish shown in full, with the restaurant that serves it. An AR dish when one exists. */
  dish: { restaurant: RawRestaurant; dish: RawDish };
  /** True when nothing with a menu was near the visitor, so any restaurant stands in. */
  isFallback: boolean;
};

/** How close counts as "nearby" for picking what to feature. */
export const NEARBY_RADIUS_M = 50_000;
const CAROUSEL_SIZE = 6;

/** Reads Vercel's approximate IP location. No browser permission is involved, and nothing is stored. */
export function parseGeo(headers: Pick<Headers, "get">): Geo {
  const num = (name: string) => {
    const raw = headers.get(name);
    const n = raw === null ? NaN : Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };
  let city: string | undefined;
  const rawCity = headers.get("x-vercel-ip-city");
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity).slice(0, 80);
    } catch {
      city = undefined; // a malformed escape is not worth failing a page for
    }
  }
  const country = headers.get("x-vercel-ip-country")?.slice(0, 2).toUpperCase() || undefined;
  const lat = num("x-vercel-ip-latitude");
  const lng = num("x-vercel-ip-longitude");
  return { city, country, ...(lat !== undefined && lng !== undefined ? { lat, lng } : {}) };
}

export function haversineM(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6_371_000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

const score = (x: { ratingAvg: number | null; ratingCount: number }) => [x.ratingAvg ?? -1, x.ratingCount] as const;

/** Highest rated first (then most ratings). Ties are broken at random, as the featured pick should vary. */
function pickBest<T extends { ratingAvg: number | null; ratingCount: number }>(items: T[], rand: () => number): T {
  const best = items.reduce((a, b) => {
    const [aa, ac] = score(a);
    const [ba, bc] = score(b);
    return ba > aa || (ba === aa && bc > ac) ? b : a;
  });
  const [ba, bc] = score(best);
  const tied = items.filter((i) => {
    const [a, c] = score(i);
    return a === ba && c === bc;
  });
  return tied[Math.floor(rand() * tied.length)] ?? best;
}

export function buildShowcase(rows: RawRestaurant[], geo: Geo, rand: () => number = Math.random): Showcase | null {
  const withMenu = rows.filter((r) => r.dishes.length > 0);
  if (withMenu.length === 0) return null;

  const visitor = geo.lat !== undefined && geo.lng !== undefined ? { lat: geo.lat, lng: geo.lng } : null;
  const near = visitor ? rows.filter((r) => haversineM(visitor, r) <= NEARBY_RADIUS_M) : [];
  const nearMenu = near.filter((r) => r.dishes.length > 0);

  const isFallback = nearMenu.length === 0;
  const pool = isFallback ? withMenu : nearMenu;

  const featured = pickBest(pool, rand);

  // An AR dish if the featured restaurant has one, else one anywhere in the pool, else its best dish.
  const arAtFeatured = featured.dishes.filter((d) => d.hasAr);
  const arInPool = pool.flatMap((restaurant) => restaurant.dishes.filter((d) => d.hasAr).map((dish) => ({ restaurant, dish })));
  const dish = arAtFeatured.length
    ? { restaurant: featured, dish: pickBest(arAtFeatured, rand) }
    : arInPool.length
      ? pickBest(arInPool.map((x) => ({ ...x, ratingAvg: x.dish.ratingAvg, ratingCount: x.dish.ratingCount })), rand)
      : { restaurant: featured, dish: pickBest(featured.dishes, rand) };

  // Distances are measured from the visitor when something is near them, otherwise from the
  // featured restaurant, so the cards read as a believable neighbourhood.
  const centre = !isFallback && visitor ? visitor : { lat: featured.lat, lng: featured.lng };
  const candidates = isFallback || !visitor ? rows : near;
  const nearest = candidates
    .map((restaurant) => ({ restaurant, distanceM: haversineM(centre, restaurant) }))
    .sort((a, b) => a.distanceM - b.distanceM)
    .slice(0, CAROUSEL_SIZE);
  // The featured restaurant is always on screen, even if six others are closer.
  if (!nearest.some((n) => n.restaurant.id === featured.id)) {
    nearest[nearest.length - 1] = { restaurant: featured, distanceM: haversineM(centre, featured) };
    nearest.sort((a, b) => a.distanceM - b.distanceM);
  }

  return {
    place: { city: geo.city || featured.city || "Dublin" },
    centre,
    restaurants: nearest,
    featured,
    dish: { restaurant: dish.restaurant, dish: dish.dish },
    isFallback,
  };
}
