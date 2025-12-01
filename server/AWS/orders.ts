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

/** Each purchased item inside an order */
export interface OrderItem {
  // Stripe-level info
  description: string;      // product name/description from Stripe
  quantity: number;         // number of units purchased
  amount_total: number;     // total price for this line in cents
  currency: string;         // currency code, e.g. "usd"

  // Snapshot of our app's product/cart data at time of purchase
  productId?: string;
  productName?: string;
  unit_price?: number;      // price per unit in your Product model
  color?: string;
  weight?: string;
  device?: string;
}

export interface Order {
  id: string;
  email: string | null;
  amount: number | null;                         // total order amount
  currency: string | null;
  status: Stripe.Checkout.Session.PaymentStatus;
  device?: string;
  caseLink?: string;
  shippingAddress: string | null;
  shippingAddressRaw?: Stripe.Address | null;
  phone: string | null;
  shippingStatus: ShippingStatus;
  createdAt: string;

  /** Array of line items (each product purchased) */
  items?: CartItem[];
}

/** Format a Stripe.Address into a single line suitable for DB storage/search. */
export function formatStripeAddress(
  addr?: Stripe.Address | null
): string | null {
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
 *
 * Assumes the frontend stored the cart in:
 *   session.metadata.cart = JSON.stringify(CartItem[])
 */
export function buildOrderFromSession(
  session: Stripe.Checkout.Session,
  cartItems: CartItem[],
): Order {
  const rawAddr = session.customer_details?.address ?? null;
  console.log("BUILDING ORDER SESSION", session.metadata);

  // 🔍 Try to parse cart from metadata.cart (if present)
  const rawCart = session.metadata?.cartData;
  if (rawCart) {
    try {
      cartItems = JSON.parse(rawCart) as CartItem[];
    } catch (err) {
      console.warn("⚠️ Failed to parse session.metadata.cart:", err);
    }
  }

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
    caseLink: session.metadata?.caseLink,
    shippingStatus: "pending",
    createdAt: new Date().toISOString(),
    items: cartItems,
  };
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

const UserCartsTableName = process.env.UserCarts;


// take in a cart and upload it to dynamoDB,
// associated with a user and a unique cartId
export async function uploadCart(
  cart: CartItem[],
  userId: string = "anonymous"
): Promise<string> {
  const cartId =
    (crypto as any).randomUUID?.() ??
    crypto.randomBytes(16).toString("hex");
  const now = new Date().toISOString();

  await dynamoDB
    .put({
      TableName: UserCartsTableName!,
      Item: {
        id: cartId,
        Username: userId,
        items: cart,
      },
    })
    .promise();
  console.log("Cart uploaded successfully.");
  return cartId;
}

export async function getCart(cartId: string): Promise<CartItem[] | null> {
  const res = await dynamoDB
    .get({
      TableName: UserCartsTableName!,
      Key: { id: cartId },
    })
    .promise();

  return (res.Item as { items?: CartItem[] } | undefined)?.items ?? null;
}