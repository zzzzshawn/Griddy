import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';

import * as schema from "../db/schema";
import type { Env } from "@repo/types/index";

export function dbClient(env: Env) {
  const { DATABASE_URL } = env;

  if (!DATABASE_URL) {
    throw new Error("Database connection string not found");
  }

  // Configure neon client
  neonConfig.fetchConnectionCache = true;
  
  // Create the SQL client
  const sql = neon(DATABASE_URL);

  // Return drizzle instance
  return drizzle(sql, { schema });
}
