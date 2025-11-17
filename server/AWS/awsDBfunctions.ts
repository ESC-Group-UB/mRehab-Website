import { dynamoDB } from "./awsConfig";
import {createUserSettings} from "./authService";

import dotenv from "dotenv";
dotenv.config();

const AuthorizedUsersTableName = process.env.AuthorizedUsers;
const ActivitySessionsTableName = process.env.ActivitySessions;
const OrdersTableName = process.env.Orders;
const UserSettingsTableName = process.env.UserSettings;



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
      TableName: ActivitySessionsTableName!,
      Item: entry,
    };

    await dynamoDB.put(params).promise();
  } catch (err) {
    console.error("❌ Failed to upload session:", err);
    throw err;
  }
}

export async function DeleteUpload(username: string, SessionID: string) {
  const params = {
    TableName: ActivitySessionsTableName!,
    Key: {
      Username: username.toLowerCase(),
      SessionID,
    },
  };

  try {
    await dynamoDB.delete(params).promise();
    return true;
  } catch (err) {
    console.error("❌ Failed to delete session:", err);
    throw err;
  }
}

export async function VerifyUpload(username: String, SessionID: String) {
  const params = {
    TableName: ActivitySessionsTableName!,
    Key: {
      Username: username.toLowerCase(),
      SessionID
    },
  };
  try {
    const result = await dynamoDB.get(params).promise();
    if (result.Item) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("❌ Failed to get session:", err);
    throw err;
  }
}

export async function VerifyUploadParms(
  expected: ActivitySessionsEntry
): Promise<boolean> {
  const params = {
    TableName: ActivitySessionsTableName!,
    Key: {
      Username: expected.Username.toLowerCase(), // matches how you write
      SessionID: expected.SessionID,
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();

    if (!result.Item) {
      return false; // nothing in DB for that key
    }

    const item = result.Item as ActivitySessionsEntry;

    // 1) Compare scalar fields directly
    const scalarKeys: (keyof ActivitySessionsEntry)[] = [
      "Username",
      "Timestamp",
      "ExerciseName",
      "Accuracy",
      "Reps",
      "Duration",
      "Hand",
      "SessionID",
      "Year",
      "Month",
      "DayOfMonth",
      "HourOfDay",
      "Minute",
      "Second",
    ];

    for (const key of scalarKeys) {
      if (String(item[key]).toLowerCase() !== String(expected[key]).toLowerCase()) {
        console.error(`Mismatch on ${String(key)}:`, {
          expected: expected[key],
          actual: item[key],
        });
        return false;
      }
    }

    // 2) Compare DeviceInfo field-by-field (object)
    const deviceOk =
      item.DeviceInfo.manufacturer === expected.DeviceInfo.manufacturer &&
      item.DeviceInfo.modelName === expected.DeviceInfo.modelName &&
      item.DeviceInfo.osName === expected.DeviceInfo.osName &&
      item.DeviceInfo.osVersion === expected.DeviceInfo.osVersion &&
      item.DeviceInfo.totalMemory === expected.DeviceInfo.totalMemory &&
      item.DeviceInfo.AppVersion === expected.DeviceInfo.AppVersion;

    if (!deviceOk) {
      console.error("Mismatch in DeviceInfo:", {
        expected: expected.DeviceInfo,
        actual: item.DeviceInfo,
      });
      return false;
    }

    // 3) Compare Scores (array)
    if (!Array.isArray(item.Scores) || !Array.isArray(expected.Scores)) {
      console.error("Scores are not arrays in one of the values");
      return false;
    }

    if (item.Scores.length !== expected.Scores.length) {
      console.error("Scores length mismatch:", {
        expected: expected.Scores.length,
        actual: item.Scores.length,
      });
      return false;
    }

    for (let i = 0; i < expected.Scores.length; i++) {
      if (item.Scores[i] !== expected.Scores[i]) {
        console.error(`Scores mismatch at index ${i}:`, {
          expected: expected.Scores[i],
          actual: item.Scores[i],
        });
        return false;
      }
    }

    // If we got here, everything matches
    return true;
  } catch (err) {
    console.error("❌ VerifyUploadParms error:", err);
    return false;
  }
}


export function getEntriesByUsername(
  username: string
): Promise<ActivitySessionsEntry[]> {
  const params = {
    TableName: ActivitySessionsTableName!,
    KeyConditionExpression: "Username = :username",
    ExpressionAttributeValues: {
      ":username": username,
    },
  };

  return dynamoDB.query(params).promise().then((data) => {
    
    return data.Items as ActivitySessionsEntry[];
  });
}

export async function getFilteredEntries(params: {
  username: string;
  exerciseName?: string;
  hand?: string;
  start?: string;
  end?: string;
}): Promise<ActivitySessionsEntry[]> {
  const { username, exerciseName, hand, start, end } = params;

  const normalizedUsername = username.toLowerCase();

  const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: ActivitySessionsTableName!,
    KeyConditionExpression: "Username = :u",
    ExpressionAttributeValues: {
      ":u": normalizedUsername,
    },
  };

  try {
    const result = await dynamoDB.query(queryInput).promise();
    let items = (result.Items as ActivitySessionsEntry[]) || [];

    // 🔎 Hand filter (case-insensitive)
    if (hand) {
      const handLower = hand.toLowerCase();
      const before = items.length;
      items = items.filter(
        entry =>
          typeof entry.Hand === "string" &&
          entry.Hand.toLowerCase() === handLower
      );
      console.log(
        `✋ Hand filter applied (${handLower}) → ${before} → ${items.length}`
      );
    }

    // 🔎 ExerciseName filter (case-insensitive)
    if (exerciseName) {
      const exLower = exerciseName.toLowerCase();
      const before = items.length;
      items = items.filter(
        entry =>
          typeof entry.ExerciseName === "string" &&
          entry.ExerciseName.toLowerCase() === exLower
      );
      console.log(
        `🏋️ ExerciseName filter applied (${exLower}) → ${before} → ${items.length}`
      );
    }

    // 🔎 Date range filter (same as before)
    if (start && end) {
      const startTime = new Date(start).getTime();
      const endTime = new Date(end).getTime();
      const before = items.length;

      items = items.filter(entry => {
        const ts = new Date(entry.Timestamp).getTime();
        return ts >= startTime && ts <= endTime;
      });

      console.log(
        `⏰ Date filter applied (${start} → ${end}) → ${before} → ${items.length}`
      );
    }

    return items;
  } catch (err) {
    console.error("❌ Error querying DynamoDB:", err);
    throw err;
  }
}


/**
 * Update the Activities dictionary for a given user.
 * @param email The user's email (primary key in UserSettings table)
 * @param updatedActivities An object with the same keys as the original activities but updated true/false values
 */
export async function updateActivities(
  email: string,
  updatedActivities: Record<string, boolean>
) {
  const now = new Date().toISOString();

  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
    TableName: UserSettingsTableName!,
    Key: {
      Username: email.toLowerCase(), // adjust if your PK is named differently
    },
    UpdateExpression: "SET Activities = :a, UpdatedAt = :u",
    ExpressionAttributeValues: {
      ":a": updatedActivities,
      ":u": now,
    },
    ConditionExpression: "attribute_exists(Username)", // ensures user settings exist
    ReturnValues: "UPDATED_NEW",
  };

  try {
    const res = await dynamoDB.update(params).promise();
    return { ok: true, message: "Activities updated.", data: res.Attributes };
  } catch (err: any) {
    if (err.code === "ConditionalCheckFailedException") {
      return { ok: false, message: "User settings do not exist." };
    }
    console.error("❌ Failed to update activities:", err);
    throw err;
  }
} 

export async function getUserSettings(email: string) {
  if (!email) {
    throw new Error("Email is required");
  }

  const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
    TableName: UserSettingsTableName!,
    Key: {
      Username: email.toLowerCase(), // adjust PK name if different
    },
  };

  try {
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      throw new Error(`User settings not found for ${email}`);
    }
    return result.Item; // full settings object
  } catch (err) {
    // cannot find activities
    await createUserSettings(email, "Unknown Device");
    const result = await dynamoDB.get(params).promise();
    if (!result.Item) {
      throw new Error(`User settings not found for ${email}`);
    }
    return result.Item; // full settings object
  }


}