import { CognitoISP } from "./awsConfig";
import { awsConfig } from "./awsConfig";
import crypto from "crypto";
import { uploadUserToDynamoDB } from "./AuthorisedUsersFunctions";
import { dynamoDB } from "./awsConfig";
import dotenv from "dotenv";
dotenv.config();


const UserPoolId = process.env.COGNITO_POOL_ID;

// get user Device from DynamoDB
export async function getUserDevice(email: string): Promise<string | null> {
  const params = {
    TableName: "UserSettings",
    Key: {
      Username: email.toLowerCase(),
    },
  };

    try {
      const result = await dynamoDB.get(params).promise();
        if (result.Item && result.Item.Device) {
          return result.Item.Device;
        } else {
          return null;
        }
    } catch (err) {
      console.error("❌ Failed to get user device:", err);
      throw err;
    }
}



