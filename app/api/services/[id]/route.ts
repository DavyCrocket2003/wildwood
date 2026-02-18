import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const db = await getDB();
    // Get service from database
    const service = await db.prepare(
      "SELECT * FROM services WHERE id = ?"
    ).bind(id).first();

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Get service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { category, title, description, price, duration, detail_text, is_active } = (await request.json()) as {
      category: string;
      title: string;
      description?: string;
      price: number;
      duration: number;
      detail_text?: string;
      is_active?: boolean;
    };

    // Check if user is admin
    const authToken = request.cookies.get("auth-token")?.value;
    if (authToken !== "admin-session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate required fields
    if (!category || !title || price === undefined || duration === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (category !== "studio" && category !== "nature") {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const db = await getDB();
    // Update service
    const result = await db.prepare(
      `UPDATE services 
       SET category = ?, title = ?, description = ?, price = ?, duration = ?, 
           detail_text = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    ).bind(category, title, description, price, duration, detail_text, is_active, id).run();

    if (result.meta.changes === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, changes: result.meta.changes });
  } catch (error) {
    console.error("Update service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if user is admin
    const authToken = request.cookies.get("auth-token")?.value;
    if (authToken !== "admin-session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    // Soft delete by setting is_active to false
    const result = await db.prepare(
      "UPDATE services SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
    ).bind(id).run();

    if (result.meta.changes === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, changes: result.meta.changes });
  } catch (error) {
    console.error("Delete service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
