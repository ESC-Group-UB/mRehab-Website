// server/cache.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  tls: process.env.REDIS_URL?.startsWith("rediss://") ? {} : undefined,
});

export async function cacheGet<T>(key: string): Promise<T|null> {
  const v = await redis.get(key);
  return v ? JSON.parse(v) as T : null;
}
export async function cacheSet(key: string, value: unknown, ttlSec: number) {
  await redis.set(key, JSON.stringify(value), "EX", ttlSec);
}
export async function cacheDel(pattern: string) {
  // simple pattern invalidation (dev-friendly)
  const keys = await redis.keys(pattern);
  if (keys.length) await redis.del(keys);
}
export default redis;
