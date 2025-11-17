// server/tests/uploadSession.int.test.ts
import request from "supertest";
import app from "../app";
import { ActivitySessionsEntry, VerifyUpload, DeleteUpload, VerifyUploadParms } from "../AWS/awsDBfunctions";

const BASE_VALID_ACTIVITY: ActivitySessionsEntry = {
  Username: "AUTOMATED_TEST",
  Timestamp: "2025-01-01T12:34:56.000Z",

  ExerciseName: "Hand Reach",
  Accuracy: 95.5,
  Reps: 12,
  Duration: 120,

  Hand: "Right",

  DeviceInfo: {
    manufacturer: "Apple",
    modelName: "iPhone 15",
    osName: "iOS",
    osVersion: "17.0",
    totalMemory: 6144,
    AppVersion: "1.0.0",
  },

  SessionID: "session-TEST",

  Scores: [0.8, 0.9, 0.95],

  Year: 2025,
  Month: 1,
  DayOfMonth: 1,
  HourOfDay: 12,
  Minute: 34,
  Second: 56,
};

// invalid payload: missing ExerciseName
const INVALID_ACTIVITY: Partial<ActivitySessionsEntry> = {
  Username: "testuser",
  Timestamp: "2025-01-01T12:34:56.000Z",
};

describe("POST /api/uploadSession/upload (integration)", () => {
  it("Uploading valid activity should return 201 and success payload", async () => {

    const res = await request(app)
      .post("/api/uploadSession/upload")
      .send(BASE_VALID_ACTIVITY);

    // Uncomment this once if you want to see the shape
    // console.log("VALID RES:", res.status, res.body);

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.message).toBe("Session uploaded and cache invalidated.");
    expect(res.body).toHaveProperty("invalidatedKeys");
  });

  it("Uploading invalid activity (missing ExerciseName) should return 400 with error", async () => {
    const res = await request(app)
      .post("/api/uploadSession/upload")
      .send(INVALID_ACTIVITY);

    // console.log("INVALID RES:", res.status, res.body);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      ok: false,
      error: "Missing required fields: Username, Timestamp, ExerciseName",
    });
  });

  it("Verifying valid upload in DB should return true", async () => {
    const uploaded = await VerifyUpload(BASE_VALID_ACTIVITY.Username, BASE_VALID_ACTIVITY.SessionID);
    expect(uploaded).toBe(true);    
  });

  it("Verifying parmaters of valid upload in DB should return true", async () => {
    const uploaded = await VerifyUploadParms(BASE_VALID_ACTIVITY);
    expect(uploaded).toBe(true);    
  });

  it("Deleting Test Upload should return true", async () => {
    const upload = await DeleteUpload(BASE_VALID_ACTIVITY.Username, BASE_VALID_ACTIVITY.SessionID);
    expect(upload).toBe(true);
  });
}
);
