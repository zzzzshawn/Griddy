import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool } from "@neondatabase/serverless";

import * as schema from "../db/schema";
import type { Env } from "@repo/types/index";

export function dbClient(env: Env) {
  const { DATABASE_URL } = env;

  if (!DATABASE_URL) {
    throw new Error("Database connection string not found");
  }

  // Create the pool
  const pool = new Pool({ connectionString: DATABASE_URL });

  // Return drizzle instance
  return drizzle(pool, { schema });
}
