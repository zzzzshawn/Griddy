import { z } from "zod";
import type { KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  DATABASE_URL: string;
  CLOUDFLARE_API_TOKEN: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_BUCKET_NAME: string;
  R2_ACCOUNT_ID: string;
  RATE_LIMITER: KVNamespace;
  GEMINI_API_KEY: string;
}

export const generateImageSchema = z.object({
  prompt: z.string(),
});

export const queryImageSchema = z.object({
  query: z.string().optional(),
  cursor: z.string().optional(),
});
