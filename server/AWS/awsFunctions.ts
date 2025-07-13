import { S3 } from './awsConfig';

export async function listFilesInBucket(prefix = "") {
  try {
    const params = {
      Bucket: process.env.S3BUCKET!,
      Prefix: prefix, // optional folder path (e.g., "user123/uploads/")
    };

    const data = await S3.listObjectsV2(params).promise();
    console.log("✅ Files:", data.Contents);
    return data.Contents;
  } catch (err) {
    console.error("❌ Error listing files:", err);
    throw err;
  }
}

export async function getFileContents(key: string): Promise<string> {
  try {
    const params = {
      Bucket: process.env.S3BUCKET!,
      Key: key, // e.g., "reports/summary.txt" or "uploads/data.json"
    };

    const data = await S3.getObject(params).promise();

    if (data.Body) {
      // Convert Buffer to string (assuming UTF-8 encoded text file)
      const content = data.Body.toString("utf-8");
      console.log("📄 File content:", content);
      return content;
    } else {
      throw new Error("File has no content.");
    }
  } catch (err) {
    console.error("❌ Error retrieving file content:", err);
    throw err;
  }
}