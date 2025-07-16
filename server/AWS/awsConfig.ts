// mRehabReactNative/src/config/awsConfig.ts

import AWS from "aws-sdk";

export const awsConfig = {
  accessKeyId: process.env.ACCESSKEYID as string,
  secretAccessKey: process.env.SECRETACCESSKEY as string,
  region: "us-east-2",
  s3Bucket: process.env.S3BUCKET as string,

  // 🔐 Cognito-specific config
  userPoolId: process.env.COGNITO_USER_POOL_ID as string,
  clientId: process.env.COGNITO_CLIENT_ID as string,
  identityPoolId: process.env.COGNITO_POOL_ID as string, // Optional if using Identity Pools
};

AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});

export const dynamoDB = new AWS.DynamoDB.DocumentClient();
export const S3 = new AWS.S3();

// 🧠 Add Cognito Identity Service Provider
export const CognitoISP = new AWS.CognitoIdentityServiceProvider();
