import { sql } from "drizzle-orm";
import { text, timestamp, uniqueIndex, pgTableCreator, real } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `public.${name}`);

export const images = pgTable(
  "images",
  {
    id: text("id").primaryKey(),
    prompt: text("prompt").notNull(),
    embedding: real("embedding").array().notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  },
  (table) => ({
    embeddingIndex: uniqueIndex("embedding_index").on(table.id),
  })
);
