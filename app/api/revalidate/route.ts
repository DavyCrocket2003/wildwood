import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * POST /api/revalidate
 *
 * On-demand revalidation endpoint. Call this from a Google Apps Script
 * trigger (onEdit) to instantly purge the ISR cache when the Google
 * Sheet is updated.
 *
 * Required: Set the REVALIDATE_SECRET environment variable in your
 * Cloudflare Pages project settings. Pass it as a Bearer token or
 * in the `secret` query parameter.
 *
 * Examples:
 *   POST /api/revalidate?secret=YOUR_SECRET
 *   POST /api/revalidate  (with Authorization: Bearer YOUR_SECRET)
 */
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
    // Revalidate all pages that depend on sheet data
    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Revalidation failed:", err);
    return NextResponse.json(
      { error: "Revalidation failed" },
      { status: 500 },
    );
  }
}
