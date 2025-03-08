import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { hc } from "hono/client";
import type { APIResponses } from "@repo/worker";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getIdFromUrl(url: string): string | null {
  try {
    const parsedUrl = new URL(url)
    const pathSegments = parsedUrl.pathname.split("/")
    const filename = pathSegments.pop()

    if (filename) {
      const id = filename.split(".").slice(0, -1).join(".")
      return id
    } 

    return null
  } catch (error) {
    console.error("Invalid URL:", error)
    return null
  }
}

export const api: any = hc<APIResponses>(process.env.NEXT_PUBLIC_SERVER_URL!);
