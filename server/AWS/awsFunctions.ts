import { S3, dynamoDB } from './awsConfig';

export async function listFilesInBucket(prefix = "") {
  try {
    const params = {
      Bucket: process.env.S3BUCKET!,
      Prefix: prefix,
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
      Key: key,
    };

    const data = await S3.getObject(params).promise();

    if (data.Body) {
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

// // 🔄 Optional utility: Parse an S3 JSON file into an ActivitySessionsEntry
// export async function parseJsonToEntry(key: string, doctorId: string): Promise<ActivitySessionsEntry> {
//   const content = await getFileContents(key);
//   const json = JSON.parse(content);

//   const entry: ActivitySessionsEntry = {
//     UserName: json.UserName,
//     Timestamp: json.Timestamp,
//     ExerciseName: json.Name,
//     Accuracy: json.Accuracy,
//     Reps: json.Reps,
//     Duration: json.Duration,
//     Hand: json.Hand,
//     DoctorID: doctorId,
//     S3Key: key,
//     DeviceInfo: {
//       manufacturer: json.manufacturer,
//       modelName: json.modelName,
//       osName: json.osName,
//       osVersion: json.osVersion,
//       totalMemory: json.totalMemory,
//     },
//     Latitude: json.latitude ?? -1,
//     Longitude: json.longitude ?? -1,
//     Notes: json.Notes ?? "",
//     Reviewed: false, // Default value
//   };

//   return entry;
// }

