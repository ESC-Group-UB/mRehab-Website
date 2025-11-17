import express, { Request, Response } from "express";
import { ActivitySessionsEntry } from "../AWS/awsDBfunctions";
import { uploadSessionToDynamoDB } from "../AWS/awsDBfunctions";
import { cacheGet, cacheSet, cacheDel } from "../cache"; // assumes cacheDel can accept patterns

const router = express.Router();

const CACHE_NS = "mrehab:activity:v1";

// Helpers
function toISOIfPossible(ts: string): string {
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid Timestamp");
  return d.toISOString();
}

router.post("/upload", async (req: Request, res: Response) => {
  console.log("POST /api/uploadSession/upload  called")
  try {
    const body = req.body as Partial<ActivitySessionsEntry>;
    

    if (!body?.Username || !body?.Timestamp || !body?.ExerciseName) {
      res.status(400).json({
        ok: false,
        error: "Missing required fields: Username, Timestamp, ExerciseName",
      });
      return;
    }

    // --- Normalize at the boundary (prevents future cache misses) ---
    const normalized: ActivitySessionsEntry = {
      ...body,
      Username: body.Username!.toLowerCase(),
      Timestamp: toISOIfPossible(body.Timestamp!),
      ExerciseName: body.ExerciseName!.trim(),
      Hand: body.Hand === "Right" ? "Right" : "Left", // default Left if not provided/invalid
      // Provide safe fallbacks for optional fields if your type allows undefined, else ensure they exist:
      DeviceInfo: body.DeviceInfo ?? {
        manufacturer: "unknown",
        modelName: "unknown",
        osName: "unknown",
        osVersion: "unknown",
        totalMemory: 0,
        AppVersion: "unknown",
      },
      SessionID: body.SessionID ?? crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`,
      Accuracy: Number(body.Accuracy ?? 0),
      Reps: Number(body.Reps ?? 0),
      Duration: Number(body.Duration ?? 0),
      Scores: Array.isArray(body.Scores) ? body.Scores : [],
      Year: Number(body.Year ?? new Date(body.Timestamp!).getUTCFullYear()),
      Month: Number(body.Month ?? new Date(body.Timestamp!).getUTCMonth() + 1),
      DayOfMonth: Number(body.DayOfMonth ?? new Date(body.Timestamp!).getUTCDate()),
      HourOfDay: Number(body.HourOfDay ?? new Date(body.Timestamp!).getUTCHours()),
      Minute: Number(body.Minute ?? new Date(body.Timestamp!).getUTCMinutes()),
      Second: Number(body.Second ?? new Date(body.Timestamp!).getUTCSeconds()),
    } as ActivitySessionsEntry;

    // --- Write to DynamoDB ---
    await uploadSessionToDynamoDB(normalized);
    

    // --- Invalidate cache (simple user-wide nuke) ---
    // Expect your GET endpoints to cache with keys like:
    // mrehab:activity:v1:{username}:{filtersHash}
    const pattern = `${CACHE_NS}:${normalized.Username}:*`;

    // If your cacheDel supports patterns, this will remove all matching keys and return count.
    // If not, see note below to implement a scan+del in your cache module.
    const invalidatedCount = await cacheDel(pattern);

    res.status(201).json({
      ok: true,
      message: "Session uploaded and cache invalidated.",
      invalidatedKeys: invalidatedCount ?? null,
    });
  } catch (err: any) {
    console.error("❌ /upload error:", err);
    res.status(500).json({ ok: false, error: "Internal server error" });
  }
});


router.get("/test-upload", async (req: Request, res: Response) => {
  try {
    const username = (req.query.username as string) || "rkumar32@buffalo.edu";
    const exercise = (req.query.exercise as string) || "Vertical Mug";
    const timestamp =
      (req.query.timestamp as string) || new Date().toISOString();

    const payload = {
      Username: username,
      Timestamp: timestamp,
      ExerciseName: exercise,
      // (Your upload route will normalize/fill defaults for other fields)
    };

    // Call your existing upload endpoint
    const port = process.env.PORT || 5000;
    const url = `http://127.0.0.1:${port}/api/uploadSession/upload`;

    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await resp.json().catch(() => ({}));
    res.status(resp.status).json({
      ok: resp.ok,
      called: url,
      sentPayload: payload,
      response: data,
    });
  } catch (err: any) {
    console.error("❌ /api/dev/test-upload error:", err);
    res.status(500).json({ ok: false, error: err?.message || "error" });
  }
});

export default router;

