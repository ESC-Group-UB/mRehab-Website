// server/routes/aws.ts
import express, { Request, Response } from "express";
import {
  uploadSessionToDynamoDB,
  ActivitySessionsEntry,
  getFilteredEntries,
} from "../AWS/awsDBfunctions";
import { migrateS3ToDynamoDB } from "../AWS/s3todynanmoutil";

const router = express.Router();

// /api/aws/uploadtest
router.get("/uploadtest", async (req: Request, res: Response) => {
  const now = new Date();
  const isoTimestamp = now.toISOString();

  const testEntry: ActivitySessionsEntry = {
    Username: "rkumar32@buffalo.edu",
    Timestamp: isoTimestamp,
    ExerciseName: "Horizontal Bowl",
    Accuracy: 150,
    Reps: 5,
    Duration: 17.3,
    Hand: "Left",
    DeviceInfo: {
      manufacturer: "Samsung",
      modelName: "Galaxy S22",
      osName: "Android",
      osVersion: "13.0",
      totalMemory: 6144000000,
      AppVersion: "1.0.3"
    },
    SessionID: "activity_test_001",
    Scores: [89.2, 91.7],
    Year: now.getFullYear(),
    Month: now.getMonth() + 1,
    DayOfMonth: now.getDate(),
    HourOfDay: now.getHours(),
    Minute: now.getMinutes(),
    Second: now.getSeconds()
  };

  try {
    await uploadSessionToDynamoDB(testEntry);
    res.send({ message: "✅ Test entry uploaded successfully", entry: testEntry });
  } catch (err) {
    console.error("❌ Error uploading test entry:", err);
    res.status(500).send({ error: "Failed to upload test entry", details: err instanceof Error ? err.message : String(err) });
  }
});

// /api/aws/filtered
router.get("/filtered", async (req: Request, res: Response) => {
  const { username, hand, start, end, exerciseName} = req.query;
  try {
    const entries = await getFilteredEntries({
      username: username as string,
      hand: hand as string,
      start: start as string,
      end: end as string,
      exerciseName: exerciseName as string
    });
    res.json({ entries });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch filtered entries" });
  }
});

export default router;
