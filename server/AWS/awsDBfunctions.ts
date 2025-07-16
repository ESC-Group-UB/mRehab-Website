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

export async function getFilteredEntries(params: {
  username: string;
  hand?: string;
  start?: string;
  end?: string;
}): Promise<ActivitySessionsEntry[]> {
  const { username, hand, start, end } = params;

  const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: "ActivitySessions",
    KeyConditionExpression: "Username = :u",
    ExpressionAttributeValues: {
      ":u": username,
    },
  };

  try {
    const result = await dynamoDB.query(queryInput).promise();
    let items = result.Items as ActivitySessionsEntry[] || [];

    // In-memory filters for optional fields
    if (hand) {
      items = items.filter(entry => entry.Hand === hand);
    }

    if (start && end) {
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      items = items.filter(entry => {
        const ts = new Date(entry.Timestamp).getTime();
        return ts >= startTime && ts <= endTime;
      });
    }

    return items;
  } catch (err) {
    console.error("❌ Error querying DynamoDB:", err);
    throw err;
  }
}