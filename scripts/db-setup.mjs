import { readdir, readFile } from "node:fs/promises";
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

if (hostOverride) databaseUrl.hostname = hostOverride;
if (useSsl) databaseUrl.searchParams.delete("sslmode");

const client = new pg.Client({
  connectionString: databaseUrl.toString(),
  ssl: useSsl
    ? { rejectUnauthorized: true, servername: hostOverride || databaseUrl.hostname }
    : undefined,
});

try {
  await client.connect();
  const migrationDir = resolve(process.cwd(), "db/migrations");
  const migrations = (await readdir(migrationDir)).filter((file) => file.endsWith(".sql")).sort();

  for (const file of migrations) {
    const relativePath = `db/migrations/${file}`;
    await client.query(await readFile(resolve(process.cwd(), relativePath), "utf8"));
    console.log(`Applied ${relativePath}`);
  }

  await client.query(await readFile(resolve(process.cwd(), "db/seed.sql"), "utf8"));
  console.log("Applied db/seed.sql");
  console.log("Database setup complete.");
} finally {
  await client.end();
}
