import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import {parseCheckoutWebhookData, handleCustomerEmail, CheckoutEventData, handleInternalCheckoutEmail} from './scripts/checkoutwebhook';
import filterCheckoutEvent from './scripts/filterwebhooks';
import {listFilesInBucket, getFileContents} from './AWS/awsFunctions';
import {uploadSessionToDynamoDB, ActivitySessionsEntry, getEntriesByUsername} from './AWS/awsDBfunctions';
import { get } from 'http';
import {migrateS3ToDynamoDB} from "./AWS/s3todynanmoutil";


const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil',
});

// ✅ Webhook secret (from Stripe CLI)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// ✅ Use CORS normally
app.use(cors());

// 👇 Mount the raw body parser *before* any middleware that consumes the body (like express.json)
app.post('/api/stripe', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const checkoutSession = filterCheckoutEvent(req, stripe, webhookSecret);

  if (checkoutSession) {
    console.log('✅ Checkout complete! Session:', checkoutSession);
    const checkoutEventData  = await parseCheckoutWebhookData(checkoutSession);
    handleCustomerEmail(checkoutEventData);
    // handleInternalCheckoutEmail(checkoutEventData);
    // You can pass to a handler here if needed:
    // handleCheckoutCompletion(checkoutSession);
  }

  res.sendStatus(200);
});

// ✅ Optional: Health check
app.get('/api/hello', (_req, res) => {
  res.send({ message: 'Hello from backend' });
});

app.get('/api/aws', (req: Request, res: Response) => {
  // listFilesInBucket();
  getFileContents("activity/Heamchand_Horizontal Mug_20250626_0952_JSON.json")

  res.send({
    accessKeyId: process.env.ACCESSKEYID,
    secretAccessKey: process.env.SECRETACCESSKEY,
    region: "us-east-2",
    s3Bucket: process.env.S3BUCKET,
  });
});

app.get('/api/aws/uploadtest', async (req: Request, res: Response) => {
  const now = new Date();
  const isoTimestamp = now.toISOString();

  const testEntry: ActivitySessionsEntry = {
    Username: "TestUser",
    Timestamp: isoTimestamp,
    ExerciseName: "Shoulder Raise",
    Accuracy: 382.7,
    Reps: 5,
    Duration: 17.3,
    Hand: "Left",
    DeviceInfo: {
      manufacturer: "Samsung",
      modelName: "Galaxy S22",
      osName: "Android",
      osVersion: "13.0",
      totalMemory: 6144000000,
      AppVersion: "1.0.3"
    },
    SessionID: "activity_test_001",
    Scores: [89.2, 91.7],
    Year: now.getFullYear(),
    Month: now.getMonth() + 1,
    DayOfMonth: now.getDate(),
    HourOfDay: now.getHours(),
    Minute: now.getMinutes(),
    Second: now.getSeconds()
  };

  try {
    await uploadSessionToDynamoDB(testEntry);
    res.send({ message: '✅ Test entry uploaded successfully', entry: testEntry });
  } catch (err) {
    console.error('❌ Error uploading test entry:', err);
    res.status(500).send({ error: 'Failed to upload test entry' });
  }
});

app.get('/api/aws/byUserName', async (req: Request, res: Response) => {
  const username = req.query.username as string;
  try {
    getEntriesByUsername(username)
      .then(entries => {
        res.send({ entries });
      })
      .catch(err => {
        if (!username) {
          return res.status(400).send({ error: 'Username query parameter is required' });
        }
        console.error('❌ Error retrieving entries:', err);
        res.status(500).send({ error: 'Failed to retrieve entries' });
      });
  } catch (err) {
    console.error('❌ Error in /byUserName:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});


app.get('/api/aws/migrate', async (req: Request, res: Response) => {
  try {
    await migrateS3ToDynamoDB();
    res.send({ message: '✅ Migration from S3 to DynamoDB completed successfully' });
  } catch (err) {
    console.error('❌ Migration failed:', err);
    res.status(500).send({ error: 'Migration failed' });
  }
});




// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

