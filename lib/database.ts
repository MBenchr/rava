import { Pool, type PoolClient } from "pg";

import { getServerEnv } from "@/lib/server-env";

declare global {
  var isandreTaqaDatabasePool: Pool | undefined;
}

export function normalizeDatabaseConnectionString(connectionString: string) {
  const parsed = new URL(connectionString);

  if (
    parsed.hostname.endsWith(".pooler.supabase.com") &&
    parsed.searchParams.get("sslmode") === "require" &&
    !parsed.searchParams.has("uselibpqcompat")
  ) {
    // node-postgres 8.22 temporarily interprets sslmode=require as
    // verify-full. Supabase's shared pooler URL uses libpq's encrypted
    // `require` semantics unless its project CA is mounted separately.
    parsed.searchParams.set("uselibpqcompat", "true");
  }

  return parsed.toString();
}

export function isDatabaseConfigured() {
  return Boolean(getServerEnv("ISANDRE_DATABASE_URL"));
}

export function getDatabasePool() {
  const connectionString = getServerEnv("ISANDRE_DATABASE_URL");
  if (!connectionString) return null;

  return (
    globalThis.isandreTaqaDatabasePool ??
    (globalThis.isandreTaqaDatabasePool = new Pool({
      application_name: "isandre-taqa",
      connectionString: normalizeDatabaseConnectionString(connectionString),
      connectionTimeoutMillis: 8_000,
      idleTimeoutMillis: 30_000,
      max: 5,
    }))
  );
}

export function getRequiredDatabasePool() {
  const pool = getDatabasePool();

  if (!pool) {
    throw new Error("DURABLE_TAQA_DATABASE_NOT_CONFIGURED");
  }

  return pool;
}

export async function withDatabaseTransaction<T>(
  operation: (client: PoolClient) => Promise<T>,
) {
  const client = await getRequiredDatabasePool().connect();

  try {
    await client.query("begin");
    const result = await operation(client);
    await client.query("commit");
    return result;
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
