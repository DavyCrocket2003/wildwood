import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = (await request.json()) as {
      username: string;
      password: string;
    };

    // Get env from request context for Cloudflare Workers
    // @ts-ignore - env is available in edge runtime
    const env = request.env || {};
    const ADMIN_USERNAME = env.ADMIN_USERNAME || process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

    // Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session cookie (24 hours)
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth-token", "admin-session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
