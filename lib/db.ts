declare global {
  // eslint-disable-next-line no-var
  var __cloudflare_context__: { env: { DB?: D1Database } } | undefined;
}

/**
 * Returns the D1 database binding from the Cloudflare context.
 *
 * OpenNext sets up the Cloudflare context in AsyncLocalStorage accessible
 * via the global __cloudflare_context__ symbol.
 */
export function getDB(): D1Database {
  // Access the Cloudflare context that OpenNext sets up
  // The context is stored in globalThis[Symbol.for("__cloudflare-context__")]
  const contextKey = Symbol.for("__cloudflare-context__");
  const cloudflareContext = (globalThis as { [key: symbol]: { env: { DB?: D1Database } } | undefined })[contextKey];

  if (!cloudflareContext?.env?.DB) {
    throw new Error(
      "D1 database binding (DB) not found. " +
      "Ensure wrangler.toml has a [[d1_databases]] binding named DB."
    );
  }

  return cloudflareContext.env.DB;
}
