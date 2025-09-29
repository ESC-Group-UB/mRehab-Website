import { CognitoISP } from "./awsConfig";
import { awsConfig } from "./awsConfig";
import crypto from "crypto";
import { uploadUserToDynamoDB } from "./AuthorisedUsersFunctions";
import { dynamoDB } from "./awsConfig";
import dotenv from "dotenv";
dotenv.config();

const AuthorizedUsersTableName = process.env.AuthorizedUsers;
const ActivitySessionsTableName = process.env.ActivitySessions;
const OrdersTableName = process.env.Orders;
const UserSettingsTableName = process.env.UserSettings
const UserPoolId = process.env.COGNITO_POOL_ID;


// 🔐 Generate SecretHash for Cognito if client secret is enabled
function generateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

// 📝 Sign Up a New User
export async function signUpUser(email: string, password: string, givenName: string, familyName: string, gender: string, address: string, role: string, device: string) {
  const secretHash = generateSecretHash(
    email,
    awsConfig.clientId,
    process.env.COGNITO_CLIENT_SECRET!
  );

  const params = {
    ClientId: awsConfig.clientId,
    Username: email,
    Password: password,
    SecretHash: secretHash,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "given_name", Value: givenName },
      { Name: "family_name", Value: familyName },
      { Name: "gender", Value: gender },
      { Name: "address", Value: address },
      { Name: "custom:role", Value: role },
    ],
  };

  // add user to the DynamoDB AuthorizedUsers table
  await uploadUserToDynamoDB(email);
  const result = await CognitoISP.signUp(params).promise();
  const roleAssigned = await assignRoleToUser(email, role);
  if (!roleAssigned) {
    
  }

  // add user settings
  createUserSettings(email,device);
  return result;
}

export async function createUserSettings(email: string, device: string) {
  const activities = {
    "Vertical Bowl": true,
    "Horizontal Bowl": true,
    "Horizontal Mug": true,
    "Vertical Mug": true,
    "Sip from Mug": true,
    "Quick Test Mug": true,
    "Slow Pour Mug": true,
    "Phone Number": true,
    "Quick Tap": true,
  };

  const now = new Date().toISOString();

  const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
    TableName: UserSettingsTableName!,
    Item: {
      // 🔑 Adjust PK name if your table uses a different key
      Username: email.toLowerCase(),
      Activities: activities,
      Device: device,
      CreatedAt: now,
      UpdatedAt: now,
    },
    // ✅ Don’t overwrite if settings already exist
    ConditionExpression: "attribute_not_exists(Username)",
  };

  try {
    await dynamoDB.put(params).promise();
    return { ok: true, message: "User settings created." };
  } catch (err: any) {
    if (err.code === "ConditionalCheckFailedException") {
      // Row already exists — this is fine for sign-up flow being retried
      return { ok: false, message: "Settings already exist for this user." };
    }
    console.error("Failed to create user settings:", err);
    throw err;
  }
}

async function assignRoleToUser(email: string, role: string): Promise<boolean> {
  const params = {
    UserPoolId: UserPoolId as string,
    Username: email,
    GroupName: role,
  };
  const result = await CognitoISP.adminAddUserToGroup(params).promise();
  if (result.$response.error) {
    
    return false;
  }
  
  return true;
}

// ✅ Confirm sign up with code sent to email
export async function confirmUser(email: string, code: string) {
  const secretHash = generateSecretHash(
    email,
    awsConfig.clientId,
    process.env.COGNITO_CLIENT_SECRET!
  );

  const params = {
    ClientId: awsConfig.clientId,
    Username: email,
    ConfirmationCode: code,
    SecretHash: secretHash,
  };

  return CognitoISP.confirmSignUp(params).promise();
}

// 🔐 Log in (authenticate)
export async function loginUser(email: string, password: string) {
  const secretHash = generateSecretHash(
    email,
    awsConfig.clientId,
    process.env.COGNITO_CLIENT_SECRET!
  );

  const params = {
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: awsConfig.clientId,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  };

  return CognitoISP.initiateAuth(params).promise();
}

// check if vaild email
export async function checkIfValidEmail(email: string): Promise<boolean> {
  const params = {
    UserPoolId:  UserPoolId as string,
    Filter: `email = "${email}"`,
  };
  

  const response = await CognitoISP.listUsers(params).promise();
  return !!(response.Users && response.Users.length > 0);
}


export async function getUsersFromCognito(): Promise<Array<{ name: string; email: string }>> {
  const users: Array<{ name: string; email: string }> = [];

  let paginationToken: string | undefined = undefined;

  try {
    do {
      const params: AWS.CognitoIdentityServiceProvider.ListUsersRequest = {
        UserPoolId: UserPoolId as string,
        Limit: 60,
        ...(paginationToken && { PaginationToken: paginationToken }),
      };

      const response = await CognitoISP.listUsers(params).promise();

      response.Users?.forEach((user) => {
        const email = user.Attributes?.find(attr => attr.Name === "email")?.Value || "unknown@example.com";
        const name =
          `${user.Attributes?.find(attr => attr.Name === "given_name")?.Value}
          ${user.Attributes?.find(attr => attr.Name === "family_name")?.Value}` || "Unknown User";

          email;

        users.push({ name, email });
      });

      paginationToken = response.PaginationToken;
    } while (paginationToken);

    return users;
  } catch (err) {
    console.error("❌ Failed to get users from Cognito:", err);
    throw err;
  }
}