import { describe, expect, it } from "vitest";
import { buildShowcase, haversineM, parseGeo, type RawDish, type RawRestaurant } from "@/lib/showcase";

const dish = (over: Partial<RawDish> = {}): RawDish => ({
  id: "d", name: "Dish", description: null, priceCents: 1200, currency: "EUR", category: "Mains", calories: 500,
  proteinG: null, carbsG: null, fatG: null, allergens: [], isVegetarian: false, isVegan: false, hasAr: false,
  ratingAvg: null, ratingCount: 0, ...over,
});
const place = (over: Partial<RawRestaurant>): RawRestaurant => ({
  id: "r", name: "Place", cuisines: ["irish"], city: "Dublin", country: "IE", lat: 53.3441, lng: -6.2675, priceLevel: 2,
  isDemo: true, ratingAvg: null, ratingCount: 0, dishes: [dish()], ...over,
});
const first = () => 0; // deterministic "random"

describe("parseGeo", () => {
  const h = (o: Record<string, string>) => ({ get: (k: string) => o[k] ?? null });
  it("reads Vercel's IP location headers", () => {
    expect(parseGeo(h({ "x-vercel-ip-city": "S%C3%A3o%20Paulo", "x-vercel-ip-country": "br", "x-vercel-ip-latitude": "-23.5", "x-vercel-ip-longitude": "-46.6" })))
      .toEqual({ city: "São Paulo", country: "BR", lat: -23.5, lng: -46.6 });
  });
  it("returns nothing usable when there are no headers (local dev)", () => {
    expect(parseGeo(h({}))).toEqual({ city: undefined, country: undefined });
  });
  it("ignores a half-present or non-numeric coordinate", () => {
    expect(parseGeo(h({ "x-vercel-ip-latitude": "53.3" }))).not.toHaveProperty("lat");
    expect(parseGeo(h({ "x-vercel-ip-latitude": "x", "x-vercel-ip-longitude": "y" }))).not.toHaveProperty("lng");
  });
  it("survives a malformed city escape", () => {
    expect(parseGeo(h({ "x-vercel-ip-city": "%E0%A4%A" })).city).toBeUndefined();
  });
});

describe("haversineM", () => {
  it("is about 13 km between Dublin city centre and Dalkey", () => {
    const d = haversineM({ lat: 53.3498, lng: -6.2603 }, { lat: 53.2764, lng: -6.1003 });
    expect(d).toBeGreaterThan(12_000);
    expect(d).toBeLessThan(14_000);
  });
  it("is zero for the same point", () => expect(haversineM({ lat: 1, lng: 2 }, { lat: 1, lng: 2 })).toBe(0));
});

describe("buildShowcase", () => {
  it("returns null when no restaurant has a menu, so the UI shows its empty state", () => {
    expect(buildShowcase([place({ dishes: [] })], {}, first)).toBeNull();
    expect(buildShowcase([], {}, first)).toBeNull();
  });

  it("features the highest rated nearby restaurant that has a menu", () => {
    const rows = [
      place({ id: "a", name: "A", ratingAvg: 4.1, ratingCount: 20 }),
      place({ id: "b", name: "B", ratingAvg: 4.8, ratingCount: 5, lat: 53.345, lng: -6.27 }),
      place({ id: "c", name: "C", ratingAvg: 4.8, ratingCount: 30, lat: 53.346, lng: -6.26 }),
    ];
    const s = buildShowcase(rows, { lat: 53.3498, lng: -6.2603, city: "Dublin" }, first)!;
    expect(s.featured.id).toBe("c"); // tie on 4.8 broken by more ratings
    expect(s.isFallback).toBe(false);
  });

  it("ignores nearby restaurants that have no menu when featuring", () => {
    const rows = [place({ id: "bare", ratingAvg: 5, ratingCount: 99, dishes: [] }), place({ id: "menu", ratingAvg: 3, ratingCount: 1 })];
    expect(buildShowcase(rows, { lat: 53.3441, lng: -6.2675 }, first)!.featured.id).toBe("menu");
  });

  it("prefers an AR dish at the featured restaurant", () => {
    const rows = [place({ id: "a", ratingAvg: 4, ratingCount: 3, dishes: [dish({ id: "plain", ratingAvg: 5, ratingCount: 9 }), dish({ id: "ar", hasAr: true })] })];
    expect(buildShowcase(rows, {}, first)!.dish.dish.id).toBe("ar");
  });

  it("uses an AR dish from another nearby restaurant when the featured one has none", () => {
    const rows = [
      place({ id: "top", ratingAvg: 4.9, ratingCount: 10, dishes: [dish({ id: "plain" })] }),
      place({ id: "other", ratingAvg: 3.0, ratingCount: 2, lat: 53.345, lng: -6.268, dishes: [dish({ id: "ar", hasAr: true })] }),
    ];
    const s = buildShowcase(rows, { lat: 53.3441, lng: -6.2675 }, first)!;
    expect(s.featured.id).toBe("top");
    expect(s.dish).toMatchObject({ restaurant: { id: "other" }, dish: { id: "ar" } });
  });

  it("falls back to the best dish when no AR dish exists", () => {
    const rows = [place({ dishes: [dish({ id: "meh", ratingAvg: 3, ratingCount: 2 }), dish({ id: "best", ratingAvg: 4.6, ratingCount: 8 })] })];
    expect(buildShowcase(rows, {}, first)!.dish.dish.id).toBe("best");
  });

  it("falls back to any restaurant with a menu when the visitor is nowhere near one", () => {
    const rows = [place({ id: "dub", city: "Dublin" })];
    const nyc = { lat: 40.7128, lng: -74.006, city: "New York", country: "US" };
    const s = buildShowcase(rows, nyc, first)!;
    expect(s.isFallback).toBe(true);
    expect(s.featured.id).toBe("dub");
    // the title still names the visitor's city, per the product decision
    expect(s.place.city).toBe("New York");
    // distances are measured from the featured restaurant, not 5,000 km away
    expect(s.centre).toEqual({ lat: rows[0].lat, lng: rows[0].lng });
    expect(s.restaurants[0].distanceM).toBeLessThan(1);
  });

  it("uses the featured restaurant's city when there is no visitor location at all", () => {
    expect(buildShowcase([place({ city: "Cork" })], {}, first)!.place.city).toBe("Cork");
  });

  it("returns at most six cards, nearest first, always including the featured restaurant", () => {
    const rows = Array.from({ length: 10 }, (_, i) =>
      place({ id: `r${i}`, name: `R${i}`, lat: 53.3441 + i * 0.002, lng: -6.2675, ratingAvg: i === 9 ? 5 : 3, ratingCount: 1 }),
    );
    const s = buildShowcase(rows, { lat: 53.3441, lng: -6.2675 }, first)!;
    expect(s.featured.id).toBe("r9"); // furthest, but highest rated
    expect(s.restaurants).toHaveLength(6);
    expect(s.restaurants.map((r) => r.restaurant.id)).toContain("r9");
    const d = s.restaurants.map((r) => r.distanceM);
    expect([...d].sort((a, b) => a - b)).toEqual(d);
  });

  it("breaks a full tie at random, so the featured pick varies", () => {
    const rows = [place({ id: "x" }), place({ id: "y" })];
    expect(buildShowcase(rows, {}, () => 0)!.featured.id).toBe("x");
    expect(buildShowcase(rows, {}, () => 0.99)!.featured.id).toBe("y");
  });
});
