import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    
    const db = await getDB();
    // Get content from database
    const result = await db.prepare(
      "SELECT value FROM content WHERE key = ?"
    ).bind(key).first();

    if (!result) {
      return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json({ value: result.value });
  } catch (error) {
    console.error("Get content error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const { value } = (await request.json()) as { value: string };

    if (!value) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 });
    }

    // Check if user is admin
    const authToken = request.cookies.get("auth-token")?.value;
    if (authToken !== "admin-session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    // Update content in database
    const result = await db.prepare(
      `INSERT OR REPLACE INTO content (key, value, updated_at) 
       VALUES (?, ?, CURRENT_TIMESTAMP)`
    ).bind(key, value).run();

    return NextResponse.json({ success: true, changes: result.meta.changes });
  } catch (error) {
    console.error("Update content error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
