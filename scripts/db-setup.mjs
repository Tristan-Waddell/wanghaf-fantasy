import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import pg from "pg";

const databaseUrlValue = process.env.DATABASE_URL;

if (!databaseUrlValue) {
  console.error("DATABASE_URL is required. Copy .env.example to .env.local and set it first.");
  process.exit(1);
}

const useSsl = process.env.DATABASE_SSL === "true";
const databaseUrl = new URL(databaseUrlValue);
const hostOverride = process.env.DATABASE_HOST_OVERRIDE?.trim();

if (hostOverride) {
  databaseUrl.hostname = hostOverride;
}

if (useSsl) {
  databaseUrl.searchParams.delete("sslmode");
}

const client = new pg.Client({
  connectionString: databaseUrl.toString(),
  ssl: useSsl
    ? {
        rejectUnauthorized: true,
        servername: hostOverride || databaseUrl.hostname,
      }
    : undefined,
});

try {
  await client.connect();

  for (const relativePath of ["db/migrations/001_initial.sql", "db/seed.sql"]) {
    const sql = await readFile(resolve(process.cwd(), relativePath), "utf8");
    await client.query(sql);
    console.log(`Applied ${relativePath}`);
  }

  console.log("Database setup complete.");
} finally {
  await client.end();
}
