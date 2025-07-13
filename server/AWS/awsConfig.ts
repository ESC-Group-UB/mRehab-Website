// mRehabReactNative/src/config/awsConfig.js
// IMPORTANT: Replace with your actual keys, but ideally, load these from
// environment variables or a secure configuration service for production builds.
// DO NOT COMMIT ACTUAL KEYS TO VERSION CONTROL if this file itself is committed.
// Consider adding this file to .gitignore if you put real keys here temporarily.
export const awsConfig = {
  accessKeyId: process.env.ACCESSKEYID as string, // Replace with your actual Access Key ID
  secretAccessKey: process.env.SECRETACCESSKEY as string, // Replace with your actual Secret Access Key
  region: "us-east-2", // Your AWS region
  s3Bucket: process.env.S3BUCKET as string, // Your S3 bucket name
};

// It's better to initialize AWS SDK here once
import AWS from "aws-sdk"; // Use the standard aws-sdk import

AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
});

export const S3 = new AWS.S3();
