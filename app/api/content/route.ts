import { NextResponse } from "next/server";
import { getAppData, REVALIDATE_SECONDS } from "@/lib/data";

/**
 * GET /api/content
 *
 * Public JSON proxy for database content. 
 * Returns the site content data with strong cache headers. Useful for any client-side
 * consumers or external integrations.
 */
export async function GET() {
  try {
    // Get data from database
    const appData = await getAppData();
    
    return NextResponse.json({ content: appData.content }, {
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

export const runtime = 'edge';
export const dynamic = "force-dynamic";
