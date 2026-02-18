import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
  try {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("auth-token");
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
