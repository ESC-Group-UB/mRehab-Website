// server/tests/uploadSession.filtered.int.test.ts
import request from "supertest";
import app from "../app";
import { ActivitySessionsEntry } from "../AWS/awsDBfunctions";
import { VerifyUpload } from "../AWS/awsDBfunctions";

const makeTestActivity = (): ActivitySessionsEntry => {
  const now = new Date("2025-01-01T12:00:00.000Z"); // fixed date for stability

  return {
    Username: `jest-filter-user-${Date.now()}`,
    Timestamp: now.toISOString(),

    ExerciseName: "Hand Reach",
    Accuracy: 88.5,
    Reps: 10,
    Duration: 60,

    Hand: "Right",

    DeviceInfo: {
      manufacturer: "Apple",
      modelName: "iPhone 15",
      osName: "iOS",
      osVersion: "17.0",
      totalMemory: 6144,
      AppVersion: "1.0.0",
    },

    SessionID: `jest-filter-session-${Date.now()}`,

    Scores: [0.7, 0.8, 0.9],

    Year: now.getUTCFullYear(),
    Month: now.getUTCMonth() + 1,
    DayOfMonth: now.getUTCDate(),
    HourOfDay: now.getUTCHours(),
    Minute: now.getUTCMinutes(),
    Second: now.getUTCSeconds(),
  };
};

describe("GET /api/aws/filtered (integration, real DB + cache)", () => {
  it("first call hits DB, second call hits cache for the same filter", async () => {
    // 1) Upload a real session for this user
    const activity = makeTestActivity();

    const uploadRes = await request(app)
      .post("/api/uploadSession/upload")
      .send(activity);

    expect(uploadRes.status).toBe(201);

    // ensuring it was uploaded
    const uploaded = await VerifyUpload(activity.Username, activity.SessionID);
    expect(uploaded).toBe(true);    

    // 2) Build filter range that includes that Timestamp
    const start = "2025-01-01T00:00:00.000Z";
    const end = "2025-01-02T00:00:00.000Z";

    // 3) First call → expect DB
    const res1 = await request(app)
      .get("/api/aws/filtered")
      .query({
        username: activity.Username,     // mixed case is fine, route normalizes
        hand: activity.Hand,             // "Right"
        start,
        end,
        exerciseName: activity.ExerciseName, // "Hand Reach"
      });
      
    expect(res1.status).toBe(200);
    expect(res1.body.source).toBe("db");
    expect(Array.isArray(res1.body.entries)).toBe(true);
    expect(res1.body.entries.length).toBeGreaterThan(0);

    // Optional: check that at least one entry matches our session’s ExerciseName
    const hasOurExercise = res1.body.entries.some(
      (e: any) => e.ExerciseName === activity.ExerciseName
    );
    expect(hasOurExercise).toBe(true);

    // 4) Second call with EXACT same query → should be served from cache
    const res2 = await request(app)
      .get("/api/aws/filtered")
      .query({
        username: activity.Username,
        hand: activity.Hand,
        start,
        end,
        exerciseName: activity.ExerciseName,
      });

    expect(res2.status).toBe(200);
    expect(res2.headers["x-cache"]).toBe("HIT");
    expect(res2.body.source).toBe("cache");
    expect(res2.body.entries).toEqual(res1.body.entries);
  });
});
