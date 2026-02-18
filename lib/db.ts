import { getCloudflareContext } from '@opennextjs/cloudflare';

type D1Like = {
  prepare: (sql: string) => {
    bind: (...params: any[]) => {
      first: () => Promise<any>;
      all: () => Promise<{ results: any[] }>;
      run: () => Promise<any>;
    };
  };
};

let localDb: any = null;

async function getLocalSQLite(): Promise<D1Like> {
  if (!localDb) {
    // Dynamic import only in development
    const Database = (await import("better-sqlite3")).default;
    localDb = new Database("./dev.db");
  }

  return {
    prepare(sql: string) {
      return {
        bind(...params: any[]) {
          return {
            async first() {
              const stmt = localDb!.prepare(sql);
              // Convert boolean values to integers for SQLite compatibility
              const convertedParams = params.map(param => 
                param === true ? 1 : param === false ? 0 : param
              );
              return stmt.get(...convertedParams);
            },
            async all() {
              const stmt = localDb!.prepare(sql);
              // Convert boolean values to integers for SQLite compatibility
              const convertedParams = params.map(param => 
                param === true ? 1 : param === false ? 0 : param
              );
              const results = stmt.all(...convertedParams);
              return { results };
            },
            async run() {
              const stmt = localDb!.prepare(sql);
              // Convert boolean values to integers for SQLite compatibility
              const convertedParams = params.map(param => 
                param === true ? 1 : param === false ? 0 : param
              );
              const result = stmt.run(...convertedParams);
              // Return D1-like structure for compatibility
              return {
                changes: result.changes,
                meta: {
                  last_row_id: result.lastInsertRowid
                }
              };
            }
          };
        }
      };
    }
  };
}

export async function getDB(): Promise<D1Like> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    if (env.DB) return env.DB;
  } catch {
    // Not in Cloudflare runtime — fall through to local SQLite
  }

  // Fallback to development/local SQLite
  return await getLocalSQLite();
}
