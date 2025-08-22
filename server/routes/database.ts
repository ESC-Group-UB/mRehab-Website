// server/routes/aws.ts
import express, { Request, Response } from "express";
import {
  uploadSessionToDynamoDB,
  ActivitySessionsEntry,
  getFilteredEntries,
  updateActivities,
  getUserSettings
} from "../AWS/awsDBfunctions";
import { cacheGet, cacheSet, cacheDel } from "../cache"; // <- your cache.ts


const router = express.Router();

router.get("/filtered", async (req: Request, res: Response) => {
  try {
    const { username, hand, start, end, exerciseName } = req.query;
    console.log("🔍 Filtered entries request:",  req.query);

    // 1) Normalize/clean params for a stable key
    const u = String(username || "").trim().toLowerCase();
    const h = String(hand || "any").trim().toLowerCase();
    const ex = String(exerciseName || "any").trim().toLowerCase();
    const s = String(start || "null").trim();
    const e = String(end || "null").trim();

    // Tip (optional): if u is an email/PHI, prefer a numeric userId or a hash
    // const uHash = createHash('sha256').update(u).digest('hex')

    const key = `filtered:${u}:${h}:${ex}:${s}:${e}`;

    // 2) Try cache
    const cached = await cacheGet<{ entries: any[] }>(key);
    if (cached) {
      res.setHeader("X-Cache", "HIT");

      res.json({ source: "cache", ...cached });
    }
    res.setHeader("X-Cache", "MISS");


    // 3) Fetch fresh
    const entries = await getFilteredEntries({
      username: username as string,
      hand: h === "any" ? undefined : h,
      start: s === "null" ? undefined : s,
      end: e === "null" ? undefined : e,
      exerciseName: ex === "any" ? undefined : ex,
    });

    // 4) TTL strategy: long if past-only range, short if includes "today"
    const ttl = ttlForRange(s, e); // see helper below

    await cacheSet(key, { entries }, ttl);
    res.json({ source: "db", entries });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch filtered entries" });
  }
});

// Helper: choose TTL based on whether the range includes today
function ttlForRange(startISO: string, endISO: string) {
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const start = parseMaybeISO(startISO);
  const end = parseMaybeISO(endISO);

  // If either date is invalid/missing, assume it might be "live": short TTL
  if (!start || !end) return 120; // 2 min

  // If end < today => historical => long TTL
  if (end.getTime() < today.getTime()) return 86400; // 24h

  // If range touches today or the future => short TTL
  return 120; // 2 min
}

function parseMaybeISO(s: string | undefined) {
  if (!s || s === "null") return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

router.put("/updateActivities", async(req: Request, res: Response) => {
  const { email, activities } = req.body;
  try {
    const result = await updateActivities(email, activities);
    res.json(result);
  } catch (err) {
}})


router.get("/user-settings", async (req: Request, res: Response) => {
  const { email } = req.query;
  try {
    const result = await getUserSettings(email as string);
    console.log(result);

    res.json(result);
  } catch (err) {
  }
})

export default router;
