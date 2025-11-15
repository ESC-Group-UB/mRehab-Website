import { CognitoISP } from "./awsConfig"; import { awsConfig } from "./awsConfig"; import crypto from "crypto"; import { uploadUserToDynamoDB } from "./AuthorisedUsersFunctions"; import { dynamoDB } from "./awsConfig"; import dotenv from "dotenv"; dotenv.config(); const UserPoolId = process.env.COGNITO_POOL_ID;


const AuthorizedUsersTableName = process.env.AuthorizedUsers;
const ActivitySessionsTableName = process.env.ActivitySessions;
const OrdersTableName = process.env.Orders;
const UserSettingsTableName = process.env.UserSettings

// server/AWS/intrest.ts
export type FormData = {
  name: string;
  email: string;
  device: string;          // model saved here
  phone_case?: string;     // "yes" | "no" | ""
  phone_case_link?: string;
  role: string;
  message?: string;
};

// upload interest form data to DynamoDB
export async function uploadInterestToDynamoDB(data: FormData) {
  const params = {
    TableName: "IntrestForms",
    Item: {
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        device: data.device,
        phone_case: data.phone_case || null,
        phone_case_link: data.phone_case_link || null,
        message: data.message || null,
        role: data.role,
        submittedAt: new Date().toISOString(),
    },
  };
    try {
        await dynamoDB.put(params).promise();
        
    } catch (error) {
        console.error("Error uploading interest form data:", error);
        throw error;
    }
}
