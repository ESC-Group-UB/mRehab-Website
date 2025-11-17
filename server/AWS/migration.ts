// AWS/migrateActivitySessions.ts
import dotenv from "dotenv";
dotenv.config();

import { dynamoDB } from "./awsConfig";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

// Old table: Username (PK), Timestamp (SK)
const OLD_ActivitySessionsTableName = "ActivitySessions";

// New table: Username (PK), SessionID (SK)
// NOTE: Your .env should have: ActivitySessions=ActivitySessions-id  (or whatever your new table is)
const NEW_ActivitySessionsTableName = process.env.ActivitySessions;

if (!NEW_ActivitySessionsTableName) {
  throw new Error("ActivitySessions env var is not set for NEW table");
}

/**
 * Utility to chunk an array into pieces of at most `size` elements.
 * DynamoDB BatchWriteItem supports max 25 items per request.
 */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Transform an item from the old table schema to the new one.
 * - Lowercase Username (to match your write path)
 * - Ensure SessionID exists (reuse if present, else generate from Username+Timestamp)
 */
function transformItem(
  item: DocumentClient.AttributeMap
): DocumentClient.AttributeMap {
  const username = String(item.Username).toLowerCase();
  const timestamp = String(item.Timestamp);

  let sessionId = item.SessionID as string | undefined;
  if (!sessionId) {
    // Deterministic fallback based on the old PK+SK
    sessionId = `${username}#${timestamp}`;
  }

  return {
    ...item,
    Username: username,
    SessionID: sessionId,
    // Timestamp stays in the item as a normal attribute – it's just not the sort key anymore.
  };
}

/**
 * Migrate all items from OLD_ActivitySessionsTableName
 * into NEW_ActivitySessionsTableName.
 */
export async function migrateActivitySessions(): Promise<void> {
  console.log(
    `Starting migration from "${OLD_ActivitySessionsTableName}" to "${NEW_ActivitySessionsTableName}"`
  );

  let lastEvaluatedKey: DocumentClient.Key | undefined = undefined;
  let totalMigrated = 0;

  do {
    // 1) Scan a page from the old table
    const scanResult = await dynamoDB
      .scan({
        TableName: OLD_ActivitySessionsTableName,
        ExclusiveStartKey: lastEvaluatedKey,
      })
      .promise();

    const items = scanResult.Items ?? [];

    if (!items.length) {
      console.log("No items in this page.");
    } else {
      console.log(`Fetched ${items.length} items from old table...`);
    }

    // 2) Transform items for the new table
    const transformed = items.map(transformItem);

    // 2.5) De-duplicate by new primary key: Username + SessionID
    const keyToItem = new Map<string, DocumentClient.AttributeMap>();

    for (const item of transformed) {
      const key = `${item.Username}#${item.SessionID}`;
      if (keyToItem.has(key)) {
        console.warn(
          `Duplicate key detected in source page for "${key}". Keeping the last occurrence.`
        );
      }
      keyToItem.set(key, item);
    }

    const uniqueItems = Array.from(keyToItem.values());

    // 3) Turn into WriteRequests
    const putRequests: DocumentClient.WriteRequests = uniqueItems.map(
      (item) => ({
        PutRequest: { Item: item },
      })
    );

    // 4) BatchWrite in chunks of 25
    const chunks = chunkArray(putRequests, 25);

    for (const chunk of chunks) {
      let params: DocumentClient.BatchWriteItemInput = {
        RequestItems: {
          [NEW_ActivitySessionsTableName!]: chunk,
        },
      };

      // Retry loop for unprocessed items
      while (true) {
        const res = await dynamoDB.batchWrite(params).promise();

        const unprocessed =
          res.UnprocessedItems?.[NEW_ActivitySessionsTableName!];

        if (unprocessed && unprocessed.length > 0) {
          console.warn(
            `Retrying ${unprocessed.length} unprocessed items...`
          );
          params = {
            RequestItems: {
              [NEW_ActivitySessionsTableName!]: unprocessed,
            },
          };
        } else {
          break;
        }
      }
    }

    totalMigrated += items.length; // count original items scanned
    console.log(`Migrated ${totalMigrated} source items so far...`);

    lastEvaluatedKey = scanResult.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  console.log(`✅ Migration complete. Total source items scanned: ${totalMigrated}`);
}

// Allow running directly: `npx ts-node AWS/migrateActivitySessions.ts`
if (require.main === module) {
  migrateActivitySessions()
    .then(() => {
      console.log("✅ Migration script finished successfully.");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Migration failed:", err);
      process.exit(1);
    });
}
