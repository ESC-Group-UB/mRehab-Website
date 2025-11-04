// routes/stripe.webhook.ts
import express, { Request, Response } from "express";
import Stripe from "stripe";
import {buildOrderFromSession, Order, uploadOrder} from "../AWS/orders";
import {sendOrderReceivedEmail, sendInternalOrderNotification} from "../utilities/OrderEmails";


const webhookRouter = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// IMPORTANT: raw body for Stripe signature verification
webhookRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("❌ Webhook verify failed:", message);
        res.status(400).send(`Webhook Error: ${message}`);
        return;
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      // 
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      const order:Order = buildOrderFromSession(session, lineItems);
      console.log("✅ New order received:", order);
      

      

      // TODO: save order to DB (DynamoDB, etc.)
        await uploadOrder(order);
      // TODO: send confirmation email to customer
        await sendOrderReceivedEmail(order.email ?? "jsmith720847@gmail.com", order.id);
        await sendInternalOrderNotification(
          order
        );
    }

    res.sendStatus(200);
  }
);

export default webhookRouter;
