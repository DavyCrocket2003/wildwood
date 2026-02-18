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

export async function getDB(env?: any): Promise<D1Like> {
  // Check if we're in a Cloudflare Workers environment (production)
  if (typeof globalThis !== 'undefined' && globalThis.caches) {
    // We're in Cloudflare Workers edge runtime
    if (!env || !env.DB) {
      throw new Error('Database binding not available. Make sure D1 database is properly bound to the worker.');
    }
    return env.DB;
  }

  // Fallback to development/local SQLite
  return await getLocalSQLite();
}
