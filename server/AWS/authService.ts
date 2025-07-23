import { CognitoISP } from "./awsConfig";
import { awsConfig } from "./awsConfig";
import crypto from "crypto";
import { uploadUserToDynamoDB } from "./awsDBfunctions";

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
