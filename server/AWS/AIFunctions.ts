import { dynamoDB } from "./awsConfig";
import dotenv from "dotenv";
dotenv.config();

const IntentClassifierLogsTable = process.env.IntentClassifierLogs!;

export interface AIIntentLog {
  logId: string;
  timestamp: string;
  PredictedCategory: string;
  Prompt: string;
  Scores: Record<string, number>;
  Username: string;
  UserReportedCategory?: string;
}

/**
 * Uploads AI intent log data to DynamoDB.
 */
export const logAIIntent = async (data: AIIntentLog) => {
  try {
    const params = {
      TableName: IntentClassifierLogsTable,
      Item: {
        logId: data.logId,
        timestamp: data.timestamp,
        PredictedCategory: data.PredictedCategory,
        Prompt: data.Prompt,
        Scores: data.Scores,
        Username: data.Username,
        UserReportedCategory: data.UserReportedCategory ?? "N/A",
        createdAt: new Date().toISOString()
      },
    };

    await dynamoDB.put(params).promise();
    console.log("✅ AI intent log uploaded successfully:", data.logId);
    return { success: true, message: "AI intent log uploaded successfully" };

  } catch (error) {
    console.error("❌ Error uploading AI intent log:", error);
    throw new Error("Failed to upload AI intent log to DynamoDB");
  }
};
