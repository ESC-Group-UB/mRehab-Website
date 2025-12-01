import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import styles from "./OrderHistory.module.css";

// ---- Types mirrored from backend ----
type Product = {
  id: string;
  name: string;
  price: number; // dollars, e.g. 24.99
  image_paths: string[];
  description: string;
  details: string;
};

type CartItem = {
  product: Product;
  color: string;
  weight: string;
  quantity: number;
  device?: string;
};

type ShippingStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled"
  | "failed"
  | string;

type Order = {
  id: string;
  email: string | null;
  amount: number | null;       // total in cents
  currency: string | null;
  status: string;              // Stripe.Checkout.Session.PaymentStatus
  shippingAddress: string | null;
  shippingAddressRaw?: any;
  phone: string | null;
  shippingStatus: ShippingStatus;
  createdAt: string;
  items?: CartItem[];
};

export default function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const baseURL = process.env.REACT_APP_BACKEND_API_URL;

  // Logout safety
  const handleSignOut = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  // Decode user email from Cognito idToken
  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return handleSignOut();

    try {
      const decoded: any = jwtDecode(idToken);
      setUserEmail(decoded.email || "");
    } catch {
      handleSignOut();
    }
  }, []);

  // Fetch orders for this user
  useEffect(() => {
    async function fetchOrders() {
      if (!userEmail) return;
      try {
        setLoading(true);

        const res = await fetch(
          `${baseURL}api/orders/byEmail?email=${encodeURIComponent(userEmail)}`
        );
        if (!res.ok) throw new Error(`Failed with ${res.status}`);

        const data = await res.json();

        const sorted = (data.orders || []).sort(
          (a: Order, b: Order) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setOrders(sorted);
      } catch (err: any) {
        setError(err.message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userEmail, baseURL]);

  const formatAmount = useMemo(
    () =>
      (amountCents: number | null, currency: string | null) => {
        if (amountCents == null || !currency) return "N/A";
        try {
          return new Intl.NumberFormat(undefined, {
            style: "currency",
            currency: currency.toUpperCase(),
          }).format(amountCents / 100);
        } catch {
          return `${(amountCents / 100).toFixed(2)} ${currency.toUpperCase()}`;
        }
      },
    []
  );

  const formatAddress = (shippingAddress: string | null) => {
    if (!shippingAddress) return "N/A";
    return shippingAddress;
  };

  if (loading) return <p className={styles.loading}>Loading your orders…</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!orders.length)
    return <p className={styles.empty}>No orders found for {userEmail}.</p>;

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Order History</h2>

      <ul className={styles.list}>
        {orders.map((order) => {
          const isOpen = expanded === order.id;

          return (
            <li key={order.id} className={styles.card}>
              {/* HEADER */}
              <button
                type="button"
                className={`${styles.headerBtn} ${
                  isOpen ? styles.headerBtnOpen : ""
                }`}
                onClick={() => setExpanded(isOpen ? null : order.id)}
                aria-expanded={isOpen}
              >
                <div className={styles.headerLeft}>
                  <Package className={styles.pkgIcon} size={22} aria-hidden />
                  <div>
                    <p className={styles.orderLabel}>
                      Order #{order.id.slice(-6)}
                    </p>
                    <p className={styles.meta}>
                      {formatAmount(order.amount, order.currency)} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      <span className={styles.badge}>{order.status}</span>
                    </p>
                  </div>
                </div>

                <span className={styles.chev}>
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>

              {/* DETAILS */}
              {isOpen && (
                <div className={styles.details}>
                  <p>
                    <strong>Shipping Address:</strong>{" "}
                    {formatAddress(order.shippingAddress)}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Shipping Status:</strong> {order.shippingStatus}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>

                  {/* ITEMS */}
                  <div className={styles.itemsSection}>
                    <h4 className={styles.itemsTitle}>Items</h4>

                    {order.items?.length ? (
                      <ul className={styles.itemList}>
                        {order.items.map((item, idx) => {
                          // Defensive: if data is weird, skip gracefully
                          if (!item || !item.product) return null;

                          const unitPrice = item.product.price ?? 0; // dollars
                          const lineTotalCents = Math.round(
                            unitPrice * 100 * item.quantity
                          );

                          return (
                            <li key={idx} className={styles.itemRow}>
                              <div className={styles.itemInfo}>
                                <span className={styles.itemName}>
                                  {item.product.name}
                                </span>
                                <span className={styles.itemVariant}>
                                  Device: {item.device || "N/A"} • Color:{" "}
                                  {item.color} • Weight: {item.weight}
                                </span>
                              </div>

                              <div className={styles.itemMeta}>
                                <span className={styles.itemQty}>
                                  ×{item.quantity}
                                </span>
                                <span className={styles.itemPrice}>
                                  {order.currency
                                    ? formatAmount(
                                        lineTotalCents,
                                        order.currency
                                      )
                                    : `$${(unitPrice * item.quantity).toFixed(
                                        2
                                      )}`}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p>No items on record for this order.</p>
                    )}
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
