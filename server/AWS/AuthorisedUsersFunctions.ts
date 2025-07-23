import { dynamoDB } from "./awsConfig";


export async function uploadUserToDynamoDB(
  username: string,
): Promise<void> {
  const entry = {
    Username: username,
    AllowedToView: [],
    SharingWith: [],
  };
  try {
    const params = {
      TableName: "AuthorizedUsers",
      Item: entry,
    };

    await dynamoDB.put(params).promise();
  } catch (err) {
    console.error("❌ Failed to upload session:", err);
    throw err;
  }
}


export async function addAuthorizedUser(
  username: string,
  authorizedUser: string
): Promise<void> {
  const params = {
    TableName: "AuthorizedUsers",
    Key: { Username: username },
    UpdateExpression: "SET SharingWith = list_append(if_not_exists(SharingWith, :emptyList), :newUser)",
    ExpressionAttributeValues: {
      ":newUser": [authorizedUser],
      ":emptyList": [],
    },
  }
  await dynamoDB.update(params).promise().then(() => {
    console.log(`✅ Added ${authorizedUser} to ${username}'s allowed users`);
  }).catch((err) => {
    console.error("❌ Failed to add authorized user:", err);
    throw err;

  });
}

export async function addUserToYourAllowedToView(
  username: string,
  authorizedUser: string
): Promise<void> {
  const params = {
    TableName: "AuthorizedUsers",
    Key: { Username: authorizedUser },
    UpdateExpression: "SET AllowedToView = list_append(if_not_exists(AllowedToView, :emptyList), :newUser)",
    ExpressionAttributeValues: {
      ":newUser": [username],
      ":emptyList": [],
    },
  }
  await dynamoDB.update(params).promise().then(() => {
    console.log(`✅ Added ${username} to ${authorizedUser}'s allowed to view users`);
  }).catch((err) => {
    console.error("❌ Failed to add user to allowed to view:", err);
    throw err;
  });
}