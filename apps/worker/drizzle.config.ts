import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".dev.vars" });

export default {
  schema: "./src/db/schema.ts",
  driver: "neon", // Use neon driver for PostgreSQL in serverless
  out: "./drizzle",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
} satisfies Config;
