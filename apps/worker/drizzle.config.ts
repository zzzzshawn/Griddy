import * as dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });

export default {
  schema: "./src/db/schema.ts", 
  out: "./drizzle/migrations", 
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL, 
  },
} 
