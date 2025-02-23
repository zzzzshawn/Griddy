import * as dotenv from "dotenv";

dotenv.config({ path: ".dev.vars" });
console.log(process.env.DATABASE_URL);

export default {
  schema: "./src/db/schema.ts", // Path to your schema file
  out: "./drizzle/migrations", // Path to store migrations
  dialect: "postgresql",// PostgreSQL driver
  dbCredentials: {
    url: process.env.DATABASE_URL, // Supabase connection string
  },
} 
