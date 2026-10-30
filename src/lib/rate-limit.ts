
import "server-only";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const isProduction = process.env.NODE_ENV === "production";

if (isProduction && (!redisUrl || !redisToken)) {
  throw new Error(
    "Upstash Redis credentials are required in production."
  );
}

const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

function createLimiter(
  prefix: string,
  requests: number,
  window: `${number} ${"s" | "m" | "h"}`
) {
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix: `ya-portfolio:${prefix}`,
    analytics: false,
  });
}

export const loginLimiter = createLimiter(
  "admin-login",
  5,
  "15 m"
);

export const contactLimiter = createLimiter(
  "contact-form",
  5,
  "10 m"
);

export const adminApiLimiter = createLimiter(
  "admin-api",
  30,
  "1 m"
);

// Use the IP header supplied by Netlify.
// Do not trust arbitrary client-supplied X-Forwarded-For values.
export function getClientIp(request: Request): string {
  const netlifyIp = request.headers
    .get("x-nf-client-connection-ip")
    ?.trim();

  if (netlifyIp) return netlifyIp;

  // Local development fallback.
  if (process.env.NODE_ENV !== "production") {
    return "local-development";
  }

  // Fail conservatively if the hosting platform does not provide an IP.
  return "unknown";
}

export async function enforceRateLimit(
  limiter: NonNullable<ReturnType<typeof createLimiter>>,
  identifier: string
) {
  const result = await limiter.limit(identifier);

  if (result.success) {
    return null;
  }

  const retryAfter = Math.max(
    1,
    Math.ceil((result.reset - Date.now()) / 1000)
  );

  return NextResponse.json(
    { message: "Too many requests. Please try again later." },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(result.limit),
        "X-RateLimit-Remaining": String(result.remaining),
      },
    }
  );
}
