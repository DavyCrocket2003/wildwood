import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const { env } = getCloudflareContext();
    return Response.json({
      hasDB: !!env?.DB,
      availableBindings: Object.keys(env || {}),
      envKeys: Object.keys(env || {}), // will show DB if present
    });
  } catch (error) {
    return Response.json({
      error: "Failed to get Cloudflare context",
      details: error instanceof Error ? error.message : "Unknown error",
      hasDB: false,
      availableBindings: [],
      envKeys: []
    });
  }
}
