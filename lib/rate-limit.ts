/**
 * Best-effort in-memory limiter for the waitlist route. On serverless each instance has its own
 * memory, so this only blunts bursts from one client; it is not a guarantee. Back it with a Vercel
 * Firewall rate-limit rule on /api/waitlist (docs/deployment.md).
 */
export function createLimiter({ max, windowMs, now = Date.now }: { max: number; windowMs: number; now?: () => number }) {
  const hits = new Map<string, number[]>();
  return function allow(key: string): boolean {
    const t = now();
    const recent = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    recent.push(t);
    hits.set(key, recent);
    if (hits.size > 5000) for (const [k, v] of hits) if (v.every((x) => t - x >= windowMs)) hits.delete(k);
    return true;
  };
}
