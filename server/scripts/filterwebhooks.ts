import Stripe from 'stripe';
import { Request } from 'express';

export function filterCheckoutEvent(
  req: Request,
  stripe: Stripe,
  webhookSecret: string
): Stripe.Checkout.Session | null {
  // Use bracket notation to access header
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      return event.data.object as Stripe.Checkout.Session;
    } else {
      return null;
    }
  } catch (err: any) {
    return null;
  }
}

export default filterCheckoutEvent;
