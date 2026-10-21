import { authHeaders, supabaseEnv } from "@/lib/supabase-rest";

export type DishCard = { name: string; photoUrl: string | null; restaurantName: string };
export type RestaurantCard = { name: string; photoUrl: string | null; city: string | null };
export type ProfileCard = { username: string; displayName: string; avatarUrl: string | null };

async function callRpc<T>(fn: string, id: string): Promise<T | null> {
  const env = supabaseEnv();
  if (!env) return null;

  try {
    const res = await fetch(`${env.url}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: { ...authHeaders(env.key), "Content-Type": "application/json" },
      body: JSON.stringify({ p_id: id }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`${fn} failed: ${res.status}`);
    const rows = (await res.json()) as T[];
    return rows[0] ?? null;
  } catch (error) {
    console.error(`${fn}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

/** Rich-preview data for a shared dish link. Null if not found, hidden, or Supabase isn't configured. */
export async function loadDishCard(id: string): Promise<DishCard | null> {
  const row = await callRpc<{ name: string; photo_url: string | null; restaurant_name: string }>(
    "public_dish_card",
    id,
  );
  return row ? { name: row.name, photoUrl: row.photo_url, restaurantName: row.restaurant_name } : null;
}

/** Rich-preview data for a shared restaurant link. Null if not found or Supabase isn't configured. */
export async function loadRestaurantCard(id: string): Promise<RestaurantCard | null> {
  const row = await callRpc<{ name: string; photo_url: string | null; city: string | null }>(
    "public_restaurant_card",
    id,
  );
  return row ? { name: row.name, photoUrl: row.photo_url, city: row.city } : null;
}

/** Rich-preview data for a shared profile link. Null if not found or Supabase isn't configured. */
export async function loadProfileCard(id: string): Promise<ProfileCard | null> {
  const row = await callRpc<{ username: string; display_name: string; avatar_url: string | null }>(
    "public_profile_card",
    id,
  );
  return row ? { username: row.username, displayName: row.display_name, avatarUrl: row.avatar_url } : null;
}
