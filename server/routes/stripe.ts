// routes/stripe.routes.ts
import express, { Request, Response } from "express";
import Stripe from "stripe";
const stripeRouter = express.Router();

// JSON parsing for these routes
stripeRouter.use(express.json());

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});

stripeRouter.post("/create-checkout-session", async (req: Request, res: Response) => {
  try {
    console.log("Creating checkout session for:", req.body.email);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // keep this in .env as STRIPE_PRICE_ID if you prefer
          price: process.env.STRIPE_PRICE_ID || "price_1S5FolC1LYAzcVD4rfprhGce",
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: req.body.email,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      phone_number_collection: { enabled: true },
      metadata: {
        userEmail: req.body.email,
        device: req.body.device, // from your frontend
      },
      success_url: `${process.env.FRONTEND_URL}/buy-now/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/buy-now`,
    });

    res.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Create checkout session failed:", message);
    res.status(400).json({ error: message });
  }
});

export default stripeRouter;
