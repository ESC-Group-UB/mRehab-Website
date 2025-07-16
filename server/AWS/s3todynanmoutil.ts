import { S3 } from "./awsConfig";
import { uploadSessionToDynamoDB, ActivitySessionsEntry } from "./awsDBfunctions";

const BUCKET = process.env.S3BUCKET!;
const TABLE_NAME = "ActivitySessions";
const PREFIX = ""; // adjust if needed

export async function migrateS3ToDynamoDB(): Promise<void> {
  try {
    const listed = await S3.listObjectsV2({
      Bucket: BUCKET,
      Prefix: PREFIX,
    }).promise();

    const files = listed.Contents?.filter(obj => obj.Key?.endsWith(".json")) || [];

    for (const file of files) {
      const key = file.Key!;
      try {
        const object = await S3.getObject({ Bucket: BUCKET, Key: key }).promise();
        const body = object.Body?.toString("utf-8");
        if (!body) throw new Error(`Empty body in ${key}`);

        const json = JSON.parse(body);

        const timestamp = json.Timestamp ?? new Date().toISOString();

        const entry: ActivitySessionsEntry = {
          Username: json.UserName,
          Timestamp: timestamp,
          ExerciseName: json.Name,
          Accuracy: json.Accuracy,
          Reps: json.Reps,
          Duration: json.Duration,
          Hand: json.Hand,
          DeviceInfo: {
            manufacturer: json.manufacturer,
            modelName: json.modelName,
            osName: json.osName,
            osVersion: json.osVersion,
            totalMemory: json.totalMemory,
            AppVersion: json.AppVersion ?? "unknown",
          },
          SessionID: json.id ?? `session_${Date.now()}`,
          Scores: json.Scores ?? [],
          Year: json.Year ?? new Date(timestamp).getFullYear(),
          Month: json.Month ?? new Date(timestamp).getMonth() + 1,
          DayOfMonth: json.DayOfMonth ?? new Date(timestamp).getDate(),
          HourOfDay: json.HourOfDay ?? new Date(timestamp).getHours(),
          Minute: json.Minute ?? new Date(timestamp).getMinutes(),
          Second: json.Second ?? new Date(timestamp).getSeconds(),
        };

        await uploadSessionToDynamoDB(entry);
      } catch (err) {
        console.error(`❌ Failed to migrate ${file.Key}:`, err);
      }
    }

    console.log("🎉 Migration complete.");
  } catch (err) {
    console.error("❌ Error listing files in S3:", err);
    throw err;
  }
}
