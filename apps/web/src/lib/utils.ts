import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hc } from "hono/client";
import type { APIResponses } from "@repo/worker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const api: any = hc<APIResponses>(process.env.NEXT_PUBLIC_SERVER_URL!);
