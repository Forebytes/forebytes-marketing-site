import { NextResponse } from "next/server";
import { buildShowcase, parseGeo } from "@/lib/showcase";
import { loadShowcaseRows } from "@/lib/showcase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Data for the phones on the home page, picked for this visitor's approximate location (Vercel's IP
 * geolocation: no browser permission, nothing stored). Only public aggregates ever leave here; see
 * supabase/showcase.sql for exactly what.
 */
export async function GET(req: Request) {
  const rows = await loadShowcaseRows();
  const showcase = rows ? buildShowcase(rows, parseGeo(req.headers)) : null;
  // `private`: the answer depends on who is asking, so a shared cache must not reuse it.
  return NextResponse.json({ showcase }, { headers: { "Cache-Control": "private, max-age=300" } });
}
