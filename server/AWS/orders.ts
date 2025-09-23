import { CognitoISP } from "./awsConfig"; import { awsConfig } from "./awsConfig"; import crypto from "crypto"; import { uploadUserToDynamoDB } from "./AuthorisedUsersFunctions"; import { dynamoDB } from "./awsConfig"; import dotenv from "dotenv"; dotenv.config(); const UserPoolId = process.env.COGNITO_POOL_ID;
import type Stripe from "stripe";

export type ShippingStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "failed";

export interface Order {
  id: string;
  email: string | null;
  amount: number | null;                         // amount_total can be null
  currency: string | null;                       // currency can be null
  status: Stripe.Checkout.Session.PaymentStatus; // 'paid' | 'unpaid' | 'no_payment_required'
  device?: string;                               
  shippingAddress: string | null;                // <-- formatted single-line string
  shippingAddressRaw?: Stripe.Address | null;    // <-- optional raw object (kept for reference)
  phone: string | null;
  shippingStatus: ShippingStatus;
  createdAt: string;                             // ISO string
}

/** Format a Stripe.Address into a single line suitable for DB storage/search. */
export function formatStripeAddress(addr?: Stripe.Address | null): string | null {
  if (!addr) return null;

  const line1 = addr.line1?.trim();
  const line2 = addr.line2?.trim();

  const cityState = [addr.city?.trim(), addr.state?.trim()]
    .filter(Boolean)
    .join(", ");

  const cityStatePostal = [cityState, addr.postal_code?.trim()]
    .filter(Boolean)
    .join(" ");

  const parts = [
    [line1, line2].filter(Boolean).join(", "), // "line1, line2" if both exist
    cityStatePostal,                           // "City, ST 12345"
    addr.country?.trim(),                      // "US"
  ].filter(Boolean);

  const formatted = parts.join(", ");
  return formatted.length ? formatted : null;
}

export function buildOrderFromSession(session: Stripe.Checkout.Session): Order {
  const rawAddr = session.customer_details?.address ?? null;
  return {
    id: session.id,
    email: session.customer_email ?? null,
    amount: session.amount_total ?? null,
    currency: session.currency ?? null,
    status: session.payment_status,
    device: session.metadata?.device,
    shippingAddress: formatStripeAddress(rawAddr), // <-- formatted
    shippingAddressRaw: rawAddr,                   // <-- optional raw copy
    phone: session.customer_details?.phone ?? null,
    shippingStatus: "pending",
    createdAt: new Date().toISOString(),
  };
}

export const uploadOrder = async (order: Order): Promise<void> => {
    
  if (!order?.id) {
    throw new Error("uploadOrder: order.id is required");
  }

  const params = {
    TableName: "Orders",
    Item: order,
    // Don't overwrite an existing order with the same id
    ConditionExpression: "attribute_not_exists(#id)",
    ExpressionAttributeNames: { "#id": "id" },
  };

  try {
    await dynamoDB.put(params).promise();
    
  } catch (err: any) {
    // SDK v2 uses err.code; keep name fallback just in case
    const code = err?.code || err?.name;
    if (code === "ConditionalCheckFailedException") {
      console.warn(`ℹ️ Order ${order.id} already exists — skipping insert.`);
      return;
    }
    console.error("❌ Failed to upload order:", err);
    throw err;
  }
};

export async function ordersByEmail(email: string): Promise<Order[]> {
  if (!email) {
    throw new Error("ordersByEmail: email is required");
  }

  const params = {
    TableName: "Orders",
    IndexName: "email-index", // <-- requires a GSI on "email" (see below)
    KeyConditionExpression: "#email = :email",
    ExpressionAttributeNames: {
      "#email": "email",
    },
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return (result.Items as Order[]) || [];
  } catch (err) {
    console.error("❌ Failed to fetch orders by email:", err);
    throw err;
  }
}
