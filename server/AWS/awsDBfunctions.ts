import { dynamoDB } from "./awsConfig";

export interface ActivitySessionsEntry {
  Username: string;
  Timestamp: string;
  ExerciseName: string;
  Accuracy: number;
  Reps: number;
  Duration: number;
  Hand: "Left" | "Right";
  DeviceInfo: {
    manufacturer: string;
    modelName: string;
    osName: string;
    osVersion: string;
    totalMemory: number;
    AppVersion: string;
  };
  SessionID: string;
  Scores: number[];
  Year: number;
  Month: number;
  DayOfMonth: number;
  HourOfDay: number;
  Minute: number;
  Second: number;
}

export async function uploadSessionToDynamoDB(
  entry: ActivitySessionsEntry
): Promise<void> {
  try {
    const params = {
      TableName: "ActivitySessions",
      Item: entry,
    };

    await dynamoDB.put(params).promise();
    console.log("✅ Session uploaded to DynamoDB:", entry);
  } catch (err) {
    console.error("❌ Failed to upload session:", err);
    throw err;
  }
}

export function getEntriesByUsername(
  username: string
): Promise<ActivitySessionsEntry[]> {
  const params = {
    TableName: "ActivitySessions",
    KeyConditionExpression: "Username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  };

  return dynamoDB.query(params).promise().then((data) => {
    console.log(`📄 Retrieved ${data.Items?.length || 0} entries for user ${username}`);
    return data.Items as ActivitySessionsEntry[];
  });
}