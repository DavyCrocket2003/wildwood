import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/revalidate
 *
 * On-demand cache purge endpoint for Cloudflare Pages (edge runtime).
 * Call this from a Google Apps Script trigger (onEdit) to bust the
 * Cloudflare edge cache for the opensheet URL so the next page
 * request fetches fresh data.
 *
 * Required: Set the REVALIDATE_SECRET environment variable in your
 * Cloudflare Pages project settings. Pass it as a Bearer token or
 * in the `secret` query parameter.
 *
 * Examples:
 *   POST /api/revalidate?secret=YOUR_SECRET
 *   POST /api/revalidate  (with Authorization: Bearer YOUR_SECRET)
 */

const SHEET_ID = "1EOCihY-_YXcwlWB3kFpc6kuSLLn5WfG1hko3g0cWd7U";
const SHEET_URL = `https://opensheet.elk.sh/${SHEET_ID}/Sheet1`;

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    console.error("REVALIDATE_SECRET env var is not set");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  // Accept token from query param or Authorization header
  const tokenFromQuery = request.nextUrl.searchParams.get("secret");
  const tokenFromHeader = request.headers
    .get("authorization")
    ?.replace("Bearer ", "");
  const token = tokenFromQuery || tokenFromHeader;

  if (token !== secret) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // Purge the cached opensheet response from Cloudflare's edge cache
    // by deleting it from the Cache API, then re-fetching fresh data.
    const cache = (caches as unknown as { default: Cache }).default;
    const cacheKey = new Request(SHEET_URL);
    await cache.delete(cacheKey);

    // Pre-warm the cache with fresh data
    const fresh = await fetch(SHEET_URL);
    const freshResponse = new Response(fresh.body, fresh);
    freshResponse.headers.set(
      "Cache-Control",
      "public, max-age=900, s-maxage=900",
    );
    await cache.put(cacheKey, freshResponse);

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Cache purge failed:", err);
    return NextResponse.json(
      { error: "Cache purge failed" },
      { status: 500 },
    );
  }
}

export const runtime = 'edge';
export const dynamic = "force-dynamic";
