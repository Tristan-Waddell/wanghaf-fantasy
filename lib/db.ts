import { Pool, type QueryResult, type QueryResultRow } from "pg";

const globalForDatabase = globalThis as typeof globalThis & {
  wanghafPool?: Pool;
};

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const databaseUrl = new URL(connectionString);
  const hostOverride = process.env.DATABASE_HOST_OVERRIDE?.trim();
  const useSsl = process.env.DATABASE_SSL === "true";

  if (hostOverride) {
    databaseUrl.hostname = hostOverride;
  }

  // An sslmode query parameter can replace node-postgres's explicit TLS object.
  // Keep TLS policy in one place so certificate and hostname checks stay enabled.
  if (useSsl) {
    databaseUrl.searchParams.delete("sslmode");
  }

  return new Pool({
    connectionString: databaseUrl.toString(),
    max: 10,
    ssl: useSsl
      ? {
          rejectUnauthorized: true,
          servername: hostOverride || databaseUrl.hostname,
        }
      : undefined,
  });
}

export function getPool() {
  if (!globalForDatabase.wanghafPool) {
    globalForDatabase.wanghafPool = createPool();
  }

  return globalForDatabase.wanghafPool;
}

export function query<Row extends QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
): Promise<QueryResult<Row>> {
  return getPool().query<Row>(text, [...values]);
}
