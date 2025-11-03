import { CognitoISP } from "./awsConfig";
import { awsConfig } from "./awsConfig";
import crypto from "crypto";
import { uploadUserToDynamoDB } from "./AuthorisedUsersFunctions";
import { dynamoDB } from "./awsConfig";
import dotenv from "dotenv";
dotenv.config();
import type Stripe from "stripe";

const UserPoolId = process.env.COGNITO_POOL_ID;
const AuthorizedUsersTableName = process.env.AuthorizedUsers;
const ActivitySessionsTableName = process.env.ActivitySessions;
const OrdersTableName = process.env.Orders;
const UserSettingsTableName = process.env.UserSettings;

export type ShippingStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "failed";

/** Each purchased item inside an order */
export interface OrderItem {
  description: string;          // product name/description from Stripe
  quantity: number;             // number of units purchased
  amount_total: number;         // total price for this line in cents
  currency: string;             // currency code, e.g. "usd"
}

export interface Order {
  id: string;
  email: string | null;
  amount: number | null;                         // total order amount
  currency: string | null;
  status: Stripe.Checkout.Session.PaymentStatus;
  device?: string;
  shippingAddress: string | null;
  shippingAddressRaw?: Stripe.Address | null;
  phone: string | null;
  shippingStatus: ShippingStatus;
  createdAt: string;

  /** 🆕 Array of line items (each product purchased) */
  items?: OrderItem[];
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
    [line1, line2].filter(Boolean).join(", "),
    cityStatePostal,
    addr.country?.trim(),
  ].filter(Boolean);

  const formatted = parts.join(", ");
  return formatted.length ? formatted : null;
}

/**
 * Build an Order object from a Stripe Checkout Session.
 * Optionally include detailed line items if provided.
 */
export function buildOrderFromSession(
  session: Stripe.Checkout.Session,
  lineItems?: Stripe.ApiList<Stripe.LineItem> // optional param
): Order {
  const rawAddr = session.customer_details?.address ?? null;

  const order: Order = {
    id: session.id,
    email: session.customer_email ?? null,
    amount: session.amount_total ?? null,
    currency: session.currency ?? null,
    status: session.payment_status,
    device: session.metadata?.device,
    shippingAddress: formatStripeAddress(rawAddr),
    shippingAddressRaw: rawAddr,
    phone: session.customer_details?.phone ?? null,
    shippingStatus: "pending",
    createdAt: new Date().toISOString(),
  };

  // 🧾 Attach detailed items if available
  if (lineItems?.data?.length) {
    order.items = lineItems.data.map((li) => ({
      description: li.description ?? "Unknown Item",
      quantity: li.quantity ?? 1,
      amount_total: li.amount_total ?? 0,
      currency: li.currency ?? session.currency ?? "usd",
    }));
  }

  return order;
}

/** Upload an order record to DynamoDB */
export const uploadOrder = async (order: Order): Promise<void> => {
  if (!order?.id) throw new Error("uploadOrder: order.id is required");

  const params = {
    TableName: OrdersTableName!,
    Item: order,
    ConditionExpression: "attribute_not_exists(#id)",
    ExpressionAttributeNames: { "#id": "id" },
  };

  try {
    await dynamoDB.put(params).promise();
  } catch (err: any) {
    const code = err?.code || err?.name;
    if (code === "ConditionalCheckFailedException") {
      console.warn(`ℹ️ Order ${order.id} already exists — skipping insert.`);
      return;
    }
    console.error("❌ Failed to upload order:", err);
    throw err;
  }
};

/** Query orders by email (requires GSI on 'email') */
export async function ordersByEmail(email: string): Promise<Order[]> {
  if (!email) throw new Error("ordersByEmail: email is required");

  const params = {
    TableName: OrdersTableName!,
    IndexName: "email-index",
    KeyConditionExpression: "#email = :email",
    ExpressionAttributeNames: { "#email": "email" },
    ExpressionAttributeValues: { ":email": email },
  };

  try {
    const result = await dynamoDB.query(params).promise();
    return (result.Items as Order[]) || [];
  } catch (err) {
    console.error("❌ Failed to fetch orders by email:", err);
    throw err;
  }
}
