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
import { get } from 'http';



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

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

