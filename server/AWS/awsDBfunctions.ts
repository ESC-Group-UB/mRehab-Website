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

  

  const queryInput: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: ActivitySessionsTableName!,
    KeyConditionExpression: "Username = :u",
    ExpressionAttributeValues: {
      ":u": username,
    },
  };

  

  try {
    const result = await dynamoDB.query(queryInput).promise();
    let items = (result.Items as ActivitySessionsEntry[]) || [];

    

    // 🔎 Apply optional filters
    if (hand) {
      const before = items.length;
      items = items.filter(entry => entry.Hand === hand);
      console.log(
        `✋ Hand filter applied (${hand}) → ${before} → ${items.length}`
      );
    }

    if (exerciseName) {
      const before = items.length;
      items = items.filter(
        entry =>
          entry.ExerciseName?.toLowerCase() === exerciseName.toLowerCase()
      );
      console.log(
        `🏋️ ExerciseName filter applied (${exerciseName}) → ${before} → ${items.length}`
      );
    }

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