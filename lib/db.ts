// lib/db.ts
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { cache } from 'react';
import type { D1Database } from '@cloudflare/workers-types';

export const getDB = cache((): D1Database => {
  const { env } = getCloudflareContext();  // ← sync, no {async: true}
  return env.DB;   // make sure the binding name matches your wrangler.toml
});