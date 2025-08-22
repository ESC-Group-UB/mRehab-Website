// server/cache.ts
import Redis from "ioredis";

// Create Redis client (works for local and hosted providers)
const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
});

// Get from cache
export async function cacheGet<T>(key: string): Promise<T | null> {
  const v = await redis.get(key);
  return v ? (JSON.parse(v) as T) : null;
}

// Set to cache
export async function cacheSet(key: string, value: unknown, ttlSec: number) {
  await redis.set(key, JSON.stringify(value), "EX", ttlSec);
}

// Delete keys (supports wildcards, e.g. "allowedUsers:*")
export async function cacheDel(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length) {
    await redis.del(keys);
  }
}

// Generic cache middleware for Express
import { Request, Response, NextFunction } from "express";

export function cacheRoute(ttlSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const key = req.originalUrl; // includes path + query params
    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        console.log(`Cache hit for ${key}`);
        res.json(JSON.parse(cachedData));
        return; // ✅ end early, but don't return a Response
      }

      // Monkey-patch res.json so when your handler runs,
      // the response gets cached automatically
      const originalJson = res.json.bind(res);
      res.json = (body: any) => {
        redis.set(key, JSON.stringify(body), "EX", ttlSeconds).catch(console.error);
        console.log(`Cache set for ${key} (TTL: ${ttlSeconds}s)`);
        return originalJson(body);
      };

      next(); // continue to your actual handler
    } catch (err) {
      console.error("Cache error:", err);
      next();
    }
  };
}

export default redis;
