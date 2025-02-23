import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres"; // PostgreSQL client for serverless environments
import * as schema from "../db/schema";
import { Env } from "@repo/types/index";

export function dbClient(env: Env): PostgresJsDatabase<typeof schema> {
  const { DATABASE_URL } = env;

  if (!DATABASE_URL) {
    throw new Error("Supabase database URL not found in environment variables");
  }

  // Create a PostgreSQL client using the connection string
  const client = postgres(DATABASE_URL, { ssl: "require" });

  // Initialize Drizzle with the PostgreSQL client and schema
  return drizzle(client, { schema });
}
