import { dynamoDB } from "./awsConfig";
import {checkIfValidEmail, getUsersFromCognito} from "./authService";
import { get } from "http";

import dotenv from "dotenv";
dotenv.config();

const AuthorizedUsersTableName = process.env.AuthorizedUsers;
const ActivitySessionsTableName = process.env.ActivitySessions;
const OrdersTableName = process.env.Orders;
const UserSettingsTableName = process.env.UserSettings;






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
      TableName: AuthorizedUsersTableName!,
      Item: entry,
    };

    await dynamoDB.put(params).promise();
  } catch (err) {
    console.error("❌ Failed to upload session:", err);
    throw err;
  }
}
export async function AddingAuthorizedUserHandler(
    username: string, 
    authorizedUser: string
): Promise<{message: string}> {

    if (username === authorizedUser) {
        return {"message": "❌ You cannot add yourself as an authorized user"};
    }
    var result = await checkIfValidEmail(authorizedUser)
    if (!result) {
        
        return {"message": `❌ ${authorizedUser} is not a valid email`};
    }
    var isAuth = await checkIfUserIsAuthorized(username, authorizedUser);
    if (isAuth){
        
        return {"message": `✅ ${authorizedUser} is already authorized for ${username}`};
    }
    var result = await addAuthorizedUser(username, authorizedUser);
    if (!result) {
        
        return {"message": `❌ Failed to add ${authorizedUser} to ${username}'s allowed users`};

    }
    var result2 = await addUserToYourAllowedToView(username, authorizedUser);
    if (!result2) {
        
        return {"message": `❌ Failed to add ${username} to ${authorizedUser}'s allowed to view users`};
    }
    
    return {"message": `✅ Successfully added ${authorizedUser} to ${username}'s allowed users and ${username} to ${authorizedUser}'s allowed to view users`};
    
    
}


// workflow of adding an autorized user,
// already check if auth user is a valid user
export async function checkIfUserIsAuthorized(
    username: string, 
    authorizedUser: string
): Promise<boolean> {
  const params = {
    TableName: AuthorizedUsersTableName!,
    Key: { Username: username },
    ProjectionExpression: "SharingWith",
  };

  try {
    const result = await dynamoDB.get(params).promise();
    const sharingWith = result.Item?.SharingWith || [];
    return sharingWith.includes(authorizedUser);
  } catch (err) {
    console.error("❌ Failed to check if user is authorized:", err);
    throw err;
  }
}


// check to see if user is already authorized
// if not, add to the authorized users table

// next need to add the user to the allowed to view list of the user

export async function addAuthorizedUser(
  username: string,
  authorizedUser: string
): Promise<boolean> {
  const params = {
    TableName: AuthorizedUsersTableName!,
    Key: { Username: username },
    UpdateExpression: "SET SharingWith = list_append(if_not_exists(SharingWith, :emptyList), :newUser)",
    ExpressionAttributeValues: {
      ":newUser": [authorizedUser],
      ":emptyList": [],
    },
  };
  try {
    await dynamoDB.update(params).promise();
    
    return true;
  } catch (err) {
    console.error("❌ Failed to add authorized user:", err);
    return false;
  }
}

export async function addUserToYourAllowedToView(
  username: string,
  authorizedUser: string
): Promise<boolean> {
  const params = {
    TableName: AuthorizedUsersTableName!,
    Key: { Username: authorizedUser },
    UpdateExpression: "SET AllowedToView = list_append(if_not_exists(AllowedToView, :emptyList), :newUser)",
    ExpressionAttributeValues: {
      ":newUser": [username],
      ":emptyList": [],
    },
  };
  try {
    await dynamoDB.update(params).promise();
    
    return true;
  } catch (err) {
    console.error("❌ Failed to add user to allowed to view:", err);
    return false;
  }
}


// function to get all people a user can view
export async function getAllowedToViewUsers(
  username: string
):Promise<string[]> {
  const params = {
    TableName: AuthorizedUsersTableName!,
    Key: { Username: username },
    ProjectionExpression: "AllowedToView",
  };

  try {
    const result = await dynamoDB.get(params).promise();
    return result.Item?.AllowedToView || [];
  } catch (err) {
    console.error("❌ Failed to get allowed to view users:", err);
    throw err;
  }
}

export const getAllowedToViewUsersFromCognito = async (username: string): Promise<Array<{ name: string; email: string }>> => {
  const users = await getUsersFromCognito();
  const allowedUsers = await getAllowedToViewUsers(username);
   
  
  return users.filter(user => allowedUsers.includes(user.email));
};