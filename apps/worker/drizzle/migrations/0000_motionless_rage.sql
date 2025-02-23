CREATE TABLE "public.images" (
	"id" text PRIMARY KEY NOT NULL,
	"prompt" text NOT NULL,
	"embedding" real[] NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "embedding_index" ON "public.images" USING btree ("id");