// routes/stripe.routes.ts
import express, { Request, Response } from "express";
import Stripe from "stripe";

const stripeRouter = express.Router();
stripeRouter.use(express.json());

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});

// ✅ Define your Stripe Price IDs
const PRICE_MAP: Record<string, string> = {
  "00": "price_1SX3IBC1LYAzcVD4NyUQhJjB",
  "01": "price_1SMctXC1LYAzcVD4LmqHo8qA",
  "02": "price_1SMct9C1LYAzcVD4eGWgngm3",
  "03": "price_1SMcskC1LYAzcVD4uppO4saG",

  
};

 export interface Product {
  id: string;
  name: string;
  price: number;  
  image_paths: string[];
  description: string;
  details: string;
}

 export interface CartItem {
  product: Product;
  color: string;
  weight: string;
  quantity: number;
  device?: string;
}


// ------------------ Create Checkout Session ------------------
stripeRouter.post(
  "/create-checkout-session",
  async (req: Request, res: Response) => {
    try {
      console.log("Create checkout session request body:", req.body);
      const items: CartItem[] = req.body.items;
      const { email, device, caseLink} = req.body;

      if (!items || items.length === 0) {
        res.status(400).json({ error: "No items in cart." });
        return; 
      }

      // 🧾 Convert frontend cart items → Stripe line_items format
      const lineItems = items
        .map((item) => {
          console.log("Processing item:", item);
          const priceId = PRICE_MAP[item.product.id as string];
          if (!priceId) return null; // skip unknown items
          return {
            price: priceId,
            quantity: Math.max(1, item.quantity || 1), // prevent invalid qty
          };
        })
        .filter(Boolean) as Stripe.Checkout.SessionCreateParams.LineItem[];
      console.log("Line items for Stripe:", lineItems);

      // 💳 Create checkout session
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: "payment",
        customer_email: email,
        billing_address_collection: "required",
        shipping_address_collection: { allowed_countries: ["US", "CA"] },
        phone_number_collection: { enabled: true },
        metadata: { userEmail: email, cartData: JSON.stringify(items)},
        success_url: `${process.env.FRONTEND_URL}/buy-now/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process. env.FRONTEND_URL}/buy-now`,
      });

      res.json({ url: session.url });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("Create checkout session failed:", message);
      res.status(400).json({ error: message });
    }
  }
);

export default stripeRouter;
