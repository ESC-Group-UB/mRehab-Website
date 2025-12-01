import { S3 } from "./awsConfig";
import dotenv from "dotenv";

dotenv.config();

const BUCKET = process.env.S3BUCKET as string;
const BASE_PREFIX = "latest-logging";

function sanitizeFilename(name: string) {
  return name.replace(/[^\w.\-]/g, "_");
}

export async function uploadCsvToLatestLogging(
  email: string,
  fileBuffer: Buffer,
  originalName: string
) {
  if (!BUCKET) {
    throw new Error("S3BUCKET env var is not defined");
  }

  if (!email) {
    throw new Error("Email is required to upload CSV");
  }

  const safeEmail = email.toLowerCase();
  const timestamp = new Date().toISOString().replace(/[:]/g, "-");
  const sanitizedName = sanitizeFilename(originalName || "upload.csv");
  const key = `${BASE_PREFIX}/${safeEmail}/${timestamp}-${sanitizedName}`;

  await S3.putObject({
    Bucket: BUCKET,
    Key: key,
    Body: fileBuffer,
    ContentType: "text/csv",
  }).promise();

  return {
    bucket: BUCKET,
    key,
  };
}

