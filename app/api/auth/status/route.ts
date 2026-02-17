import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get("auth-token")?.value;
    const isAdmin = authToken === "admin-session";

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Auth status error:", error);
    return NextResponse.json({ isAdmin: false });
  }
}
