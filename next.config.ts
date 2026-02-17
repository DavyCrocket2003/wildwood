import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // D1 database configuration will be handled by Cloudflare Pages
  // The DB binding "wildwood-db" will be available in API routes via env.DB
};

export default nextConfig;
