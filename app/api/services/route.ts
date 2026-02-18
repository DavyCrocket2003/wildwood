import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const db = await getDB();
    // Get all services from database
    const services = await db.prepare(
      "SELECT * FROM services WHERE is_active = true ORDER BY category, title"
    ).bind().all();

    return NextResponse.json({ services: services.results });
  } catch (error) {
    console.error("Get services error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { category, title, description, price, duration, detail_text } = (await request.json()) as {
      category: string;
      title: string;
      description?: string;
      price: number;
      duration: number;
      detail_text?: string;
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
    
    const result = await db.prepare(
      `INSERT INTO services (category, title, description, price, duration, detail_text, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, true)`
    ).bind(category, title, description, price, duration, detail_text).run();

    return NextResponse.json({ success: true, id: result.meta.last_row_id });
  } catch (error) {
    console.error("Create service error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
