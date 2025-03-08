import { Env } from "@repo/types/index"
import type { Context, Next } from "hono"

interface RateLimitMiddlewareProps {
  limit: number
  duration: number
  identifier: string
}

export function rateLimitMiddleware({
  limit,
  duration,
  identifier,
}: RateLimitMiddlewareProps) {
  return async (c: Context<{ Bindings: Env }>, next: Next) => {
    const ip = c.req.header("x-vercel-forwarded-for") || c.req.header("cf-connecting-ip") || "unknown-ip" // retrieve ip of user forwaded by vercel | cloudflare
    const key = `${identifier}_${ip}`
    const now = Date.now()

    let data = (await c.env.RATE_LIMITER.get(key, { type: "json" })) as {
      count: number
      lastRequestTime: number
    } | null

    if (!data || now - data.lastRequestTime > duration * 1000) {
      data = { count: 1, lastRequestTime: now }
    } else if (data.count >= limit) {
      return c.text("You get only 5 images/day lil bro 🤣🤣", 429)
    } else {
      data.count++
    }

    await c.env.RATE_LIMITER.put(key, JSON.stringify(data))
    await next()
  }
}
