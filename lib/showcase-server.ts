import { authHeaders, supabaseEnv } from "@/lib/supabase-rest";
import type { RawRestaurant } from "@/lib/showcase";

/** In-memory, per serverless instance. The data changes slowly and every visitor needs the same rows. */
const TTL_MS = 5 * 60 * 1000;
let cache: { at: number; rows: RawRestaurant[] } | null = null;

const SAMPLE: RawRestaurant[] = [
  {
    id: "sample-1", name: "Sample Kitchen", cuisines: ["irish"], city: "Dublin", country: "IE", lat: 53.3441, lng: -6.2675, priceLevel: 2,
    isDemo: true, ratingAvg: 4.6, ratingCount: 12,
    dishes: [
      { id: "sample-d1", name: "Sample dish", description: "Local development sample, never shown in production.", priceCents: 1400, currency: "EUR", category: "Mains", calories: 640, proteinG: 28, carbsG: 70, fatG: 22, allergens: ["gluten"], isVegetarian: false, isVegan: false, hasAr: true, ratingAvg: 4.5, ratingCount: 8 },
    ],
  },
];

/**
 * The restaurants the phones draw from, via the `site_showcase()` database function.
 * Resolves to null when Supabase is not configured or fails, and the page shows its empty state.
 * Local development (no credentials) gets a clearly labelled sample so the phones can be worked on.
 */
export async function loadShowcaseRows(): Promise<RawRestaurant[] | null> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.rows;

  const env = supabaseEnv();
  if (!env) return process.env.NODE_ENV === "production" ? null : SAMPLE;

  try {
    const res = await fetch(`${env.url}/rest/v1/rpc/site_showcase`, {
      method: "POST",
      headers: { ...authHeaders(env.key), "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`site_showcase failed: ${res.status}`);
    const rows = (await res.json()) as RawRestaurant[];
    if (!Array.isArray(rows)) throw new Error("site_showcase returned an unexpected shape");
    cache = { at: Date.now(), rows };
    return rows;
  } catch (error) {
    console.error("showcase:", error instanceof Error ? error.message : error);
    // Serve stale data in preference to nothing.
    return cache?.rows ?? null;
  }
}
