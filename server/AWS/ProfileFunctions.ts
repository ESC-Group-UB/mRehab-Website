// src/utils/AccountFunctions.ts (or wherever your utils live)
import { CognitoISP, dynamoDB } from "./awsConfig";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const AuthorizedUsersTableName = process.env.AuthorizedUsers;
const ActivitySessionsTableName = process.env.ActivitySessions;
const OrdersTableName = process.env.Orders;
const UserSettingsTableName = process.env.UserSettings;
const UserPoolId = process.env.COGNITO_POOL_ID;

// 🔐 Generate SecretHash for Cognito if client secret is enabled
export function generateSecretHash(
  username: string,
  clientId: string,
  clientSecret: string
): string {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

// ---------- TYPES ----------
export interface UpdateProfileInput {
  accessToken: string;
  sub: string; // Cognito user id (from req.user.sub)
  given_name?: string;
  last_name?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export interface ChangePasswordInput {
  accessToken: string;     // raw bearer access token
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountInput {
  sub: string; // Cognito user sub / username
}

// ---------- UPDATE PROFILE (Cognito + DynamoDB) ----------
export async function updateAccountProfile({
  accessToken,
  sub,
  given_name,
  last_name,
  address,
}: UpdateProfileInput): Promise<void> {
  if (!AuthorizedUsersTableName) {
    throw new Error("AuthorizedUsers env var is not set");
  }

  // 1) Build Cognito user attributes
  const userAttributes: { Name: string; Value: string }[] = [];

  if (given_name) {
    userAttributes.push({ Name: "given_name", Value: given_name });
  }

  if (last_name) {
    userAttributes.push({ Name: "family_name", Value: last_name });
  }

  // Build a single formatted address string for Cognito
  let addressString: string | undefined;
  if (address) {
    const parts: string[] = [];

    if (address.street) {
      parts.push(address.street);
    }

    const cityStateZip: string[] = [];
    if (address.city) {
      cityStateZip.push(address.city);
    }

    const stateZipParts: string[] = [];
    if (address.state) {
      stateZipParts.push(address.state);
    }
    if (address.zipCode) {
      stateZipParts.push(address.zipCode);
    }
    if (stateZipParts.length) {
      cityStateZip.push(stateZipParts.join(" "));
    }

    if (cityStateZip.length) {
      parts.push(cityStateZip.join(", "));
    }

    if (parts.length) {
      addressString = parts.join(", ");
    }
  }

  if (addressString) {
    userAttributes.push({ Name: "address", Value: addressString });
  }

  console.log("step 1 complete - Cognito attributes:", userAttributes);

  // 2) Update Cognito attributes (only if there is something to update)
  if (userAttributes.length > 0) {
    await CognitoISP
      .updateUserAttributes({
        AccessToken: accessToken,
        UserAttributes: userAttributes,
      })
      .promise();
  }

  console.log("step 2 complete - Cognito updated");
}

// ---------- CHANGE PASSWORD (Cognito) ----------
export async function changeAccountPassword({
  accessToken,
  currentPassword,
  newPassword,
}: ChangePasswordInput): Promise<void> {
  await CognitoISP
    .changePassword({
      AccessToken: accessToken,
      PreviousPassword: currentPassword,
      ProposedPassword: newPassword,
    })
    .promise();
}

// ---------- HELPER: delete all items for user in a table ----------
async function deleteAllForUserFromTable(
  tableName: string | undefined,
  partitionKeyName: string,
  userSub: string
): Promise<void> {
  if (!tableName) return;

  // 🔑 ASSUMPTION: the table's partition key is partitionKeyName and equals userSub.
  // If your schema is different (e.g. PK = `USER#<sub>`), adjust below.
  const queryResult = await dynamoDB
    .query({
      TableName: tableName,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: {
        "#pk": partitionKeyName,
      },
      ExpressionAttributeValues: {
        ":pk": userSub,
      },
    })
    .promise();

  if (!queryResult.Items || queryResult.Items.length === 0) return;

  const chunks: any[][] = [];
  for (let i = 0; i < queryResult.Items.length; i += 25) {
    chunks.push(queryResult.Items.slice(i, i + 25));
  }

  for (const chunk of chunks) {
    await dynamoDB
      .batchWrite({
        RequestItems: {
          [tableName]: chunk.map((item) => ({
            DeleteRequest: {
              Key: { [partitionKeyName]: item[partitionKeyName] },
            },
          })),
        },
      })
      .promise();
  }
}

// ---------- HELPER: Remove user from AllowedToView and SharingWith lists ----------
async function removeUserFromAuthorizedUsersLists(
  deletedUsername: string
): Promise<void> {
  if (!AuthorizedUsersTableName) return;

  try {
    // Scan all items in the AuthorizedUsers table
    let lastEvaluatedKey: any = undefined;
    const itemsToUpdate: Array<{ Username: string; AllowedToView?: string[]; SharingWith?: string[] }> = [];

    do {
      const scanParams: any = {
        TableName: AuthorizedUsersTableName,
      };
      if (lastEvaluatedKey) {
        scanParams.ExclusiveStartKey = lastEvaluatedKey;
      }

      const scanResult = await dynamoDB.scan(scanParams).promise();
      
      if (scanResult.Items) {
        for (const item of scanResult.Items) {
          // Skip the deleted user's own entry
          if (item.Username === deletedUsername) {
            continue;
          }

          const username = item.Username;
          const allowedToView: string[] = item.AllowedToView || [];
          const sharingWith: string[] = item.SharingWith || [];

          // Check if deleted user appears in AllowedToView
          const hasInAllowedToView = allowedToView.includes(deletedUsername);

          // Check if deleted user appears in SharingWith
          const hasInSharingWith = sharingWith.includes(deletedUsername);

          if (hasInAllowedToView || hasInSharingWith) {
            itemsToUpdate.push({
              Username: username,
              AllowedToView: hasInAllowedToView 
                ? allowedToView.filter((u: string) => u !== deletedUsername)
                : undefined,
              SharingWith: hasInSharingWith
                ? sharingWith.filter((u: string) => u !== deletedUsername)
                : undefined,
            });
          }
        }
      }

      lastEvaluatedKey = scanResult.LastEvaluatedKey;
    } while (lastEvaluatedKey);

    // Update all items that need to be modified
    for (const item of itemsToUpdate) {
      const updateExpressions: string[] = [];
      const expressionAttributeValues: any = {};

      if (item.AllowedToView !== undefined) {
        updateExpressions.push("AllowedToView = :allowedToView");
        expressionAttributeValues[":allowedToView"] = item.AllowedToView;
      }

      if (item.SharingWith !== undefined) {
        updateExpressions.push("SharingWith = :sharingWith");
        expressionAttributeValues[":sharingWith"] = item.SharingWith;
      }

      if (updateExpressions.length > 0) {
        await dynamoDB
          .update({
            TableName: AuthorizedUsersTableName,
            Key: { Username: item.Username },
            UpdateExpression: `SET ${updateExpressions.join(", ")}`,
            ExpressionAttributeValues: expressionAttributeValues,
          })
          .promise();
      }
    }

    console.log(`Removed ${deletedUsername} from ${itemsToUpdate.length} user entries`);
  } catch (err) {
    console.error("Error removing user from authorized users lists:", err);
    throw err;
  }
}

// ---------- DELETE ACCOUNT EVERYWHERE ----------
export async function deleteAccountEverywhere({
  sub,
}: DeleteAccountInput): Promise<void> {
  if (!UserPoolId) {
    throw new Error("COGNITO_POOL_ID env var is not set");
  }

  // 1) Remove user from AllowedToView and SharingWith lists in other users' entries
  // This must happen BEFORE deleting the user's own entry
  await removeUserFromAuthorizedUsersLists(sub);

  // 2) Delete from DynamoDB (user data)
  // Adjust the partition key names to match your schema!
  await deleteAllForUserFromTable(AuthorizedUsersTableName, "Username", sub);
  await deleteAllForUserFromTable(ActivitySessionsTableName, "Username", sub);
  await deleteAllForUserFromTable(UserSettingsTableName, "Username", sub);

  // 3) Delete user from Cognito (admin-level)
  await CognitoISP
    .adminDeleteUser({
      UserPoolId,
      Username: sub,
    })
    .promise();
}
