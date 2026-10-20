/**
 * Server-only access to Supabase through PostgREST with the service role key. Never import this
 * from a client component: the key bypasses RLS.
 */
export function supabaseEnv(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return url && key ? { url: url.replace(/\/$/, ""), key } : null;
}

/**
 * Supabase has two key formats. The legacy `service_role` key is a JWT and is sent as both the
 * apikey and a Bearer token. The newer `sb_secret_...` key is not a JWT and goes in `apikey` only.
 */
export function authHeaders(key: string): Record<string, string> {
  return { apikey: key, ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}) };
}
