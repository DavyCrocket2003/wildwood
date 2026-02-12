import { NextResponse } from "next/server";
import { getSheetData, REVALIDATE_SECONDS } from "@/lib/sheet-data";

/**
 * GET /api/content
 *
 * Public JSON proxy for the Google Sheet data. Returns the transformed
 * sheet data with strong cache headers. Useful for any client-side
 * consumers or external integrations.
 */
export async function GET() {
  try {
    const data = await getSheetData();

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `public, max-age=${REVALIDATE_SECONDS}, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${REVALIDATE_SECONDS * 2}`,
      },
    });
  } catch (err) {
    console.error("API /api/content error:", err);
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
