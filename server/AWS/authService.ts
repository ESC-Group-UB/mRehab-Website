import { CognitoISP } from "./awsConfig";
import { awsConfig } from "./awsConfig";
import crypto from "crypto";
import { uploadUserToDynamoDB } from "./AuthorisedUsersFunctions";
import dotenv from "dotenv";
dotenv.config();



const UserPoolId = process.env.COGNITO_POOL_ID;


// 🔐 Generate SecretHash for Cognito if client secret is enabled
function generateSecretHash(username: string, clientId: string, clientSecret: string): string {
  return crypto
    .createHmac("SHA256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

// 📝 Sign Up a New User
export async function signUpUser(email: string, password: string, givenName: string, familyName: string, gender: string, address: string) {
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
      { Name: "address", Value: address }
    ],
  };

  // add user to the DynamoDB AuthorizedUsers table
  await uploadUserToDynamoDB(email);
  return CognitoISP.signUp(params).promise();
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
  console.log(params)

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