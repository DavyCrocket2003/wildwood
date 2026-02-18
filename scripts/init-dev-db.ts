// init-dev-db.ts  ← NEW D1 VERSION
import { execSync } from "child_process";
import fs from "fs";

console.log("🚀 Initializing local D1 database (Miniflare)...\n");

// Optional: clean previous local state (recommended on big schema changes)
const stateDir = ".wrangler/state/v3/d1";
if (fs.existsSync(stateDir)) {
  console.log("🧹 Clearing previous local D1 state...");
  execSync(`rm -rf ${stateDir}`, { stdio: "inherit" });
}

// Apply the schema
console.log("📋 Applying schema.sql to local D1...");
execSync("npx wrangler d1 execute DB --local --file=schema.sql", { stdio: "inherit" });

console.log("\n✅ Local D1 database initialized successfully!");
console.log("   You can now run: pnpm dev");
console.log("   Tables ready: content, services, bookings");