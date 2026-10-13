import { NextResponse } from "next/server";
import { buildAasa } from "@/lib/aasa";

// Served at /.well-known/apple-app-site-association via a rewrite in next.config.ts.
// Apple requires a 200 with JSON and no redirects, on every host listed in the app's
// associatedDomains (www.forebytes.com), so never redirect that host.
export const dynamic = "force-dynamic";

export function GET() {
  const body = buildAasa(process.env.APPLE_TEAM_ID);
  if (!body) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(body, { headers: { "Cache-Control": "public, max-age=3600" } });
}
