import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Returns the D1 database binding.
 *
 * - **Production (Cloudflare Workers):** returns the real D1 binding from wrangler.toml.
 * - **Development (`next dev`):** returns a local D1 provided by Miniflare via
 *   `initOpenNextCloudflareForDev()` (configured in next.config.ts).
 */
export async function getDB(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) {
    throw new Error(
      "D1 database binding (DB) not found. " +
      "Ensure wrangler.toml has a [[d1_databases]] binding named DB " +
      "and initOpenNextCloudflareForDev() is called in next.config.ts for local dev."
    );
  }
  return env.DB;
}
