// lib/db.ts — Official OpenNext async way for rock-solid reliability
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";

export const getDB = cache(async (): Promise<D1Database> => {
  const { env } = await getCloudflareContext({ async: true });

  if (!env?.DB) {
    throw new Error("D1 database binding (DB) not found. Check wrangler.toml + Pages dashboard binding.");
  }

  return env.DB;
});
