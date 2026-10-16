import type { RawDish, RawRestaurant, Showcase } from "@/lib/showcase";

/**
 * What the phones show before their data arrives (as quiet blocks), and when there is none to
 * show (as plain placeholder labels). The shape matches real data so the layout never shifts.
 */
const dish = (n: number, over: Partial<RawDish> = {}): RawDish => ({
  id: `placeholder-dish-${n}`, name: "Dish name", description: "A short description of the dish and what comes with it.",
  priceCents: null, currency: "EUR", category: "Mains", calories: null, proteinG: null, carbsG: null, fatG: null,
  allergens: [], isVegetarian: false, isVegan: false, hasAr: true, ratingAvg: null, ratingCount: 0, ...over,
});

const restaurant = (n: number): RawRestaurant => ({
  id: `placeholder-${n}`, name: "Restaurant name", cuisines: ["restaurant"], city: "Your city", country: null,
  lat: 53.3441 + (n - 2) * 0.0016, lng: -6.2675 + ((n % 3) - 1) * 0.002, priceLevel: null, isDemo: false,
  ratingAvg: null, ratingCount: 0, dishes: [dish(1), dish(2), dish(3)],
});

const rows = [1, 2, 3, 4].map(restaurant);

export const PLACEHOLDER: Showcase = {
  place: { city: "your city" },
  centre: { lat: 53.3441, lng: -6.2675 },
  restaurants: rows.map((r, i) => ({ restaurant: r, distanceM: 180 + i * 240 })),
  featured: rows[1],
  dish: { restaurant: rows[1], dish: rows[1].dishes[0] },
  isFallback: true,
};
