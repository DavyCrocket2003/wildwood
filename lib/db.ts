import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Returns the D1 database binding.
 *
 * Tries multiple methods to access the DB binding:
 * 1. getCloudflareContext() - for local dev with initOpenNextCloudflareForDev
 * 2. globalThis.env - for production Cloudflare Workers
 */
export function getDB(): D1Database {
  // Try getCloudflareContext first (works in dev with Miniflare)
  try {
    const { env } = getCloudflareContext();
    if (env.DB) return env.DB;
  } catch {
    // Fall through to global approach
  }

  // Try global env (works in production Cloudflare Workers)
  const globalEnv = (globalThis as unknown as { env?: { DB?: D1Database } }).env;
  if (globalEnv?.DB) return globalEnv.DB;

  throw new Error(
    "D1 database binding (DB) not found. " +
    "Ensure wrangler.toml has a [[d1_databases]] binding named DB."
  );
}
