import React, { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import styles from "./OrderHistory.module.css";

type OrderItem = {
  description: string;
  quantity: number;
  amount_total: number;
  currency: string;
};

type Order = {
  id: string;
  email: string | null;
  amount: number | null; // cents
  currency: string | null; // e.g., "usd"
  status: string;
  device?: string;
  shippingAddress: any;
  phone: string | null;
  shippingStatus: string;
  createdAt: string; // ISO
  items?: OrderItem[];
};

export default function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const baseURL = process.env.REACT_APP_BACKEND_API_URL;

  // ✅ Sign out utility
  const handleSignOut = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  // ✅ Decode user email
  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return handleSignOut();

    try {
      const decoded: any = jwtDecode(idToken);
      setUserEmail(decoded.email || "");
    } catch (err) {
      console.error("❌ Error decoding token", err);
      handleSignOut();
    }
  }, []);

  // ✅ Fetch user orders
  useEffect(() => {
    async function fetchOrders() {
      if (!userEmail) return;
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${baseURL}api/orders/byEmail?email=${encodeURIComponent(userEmail)}`
        );
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userEmail, baseURL]);

  // ✅ Formatting utilities
  const formatAmount = useMemo(() => {
    return (amount: number | null, currency: string | null) => {
      if (amount == null || !currency) return "N/A";
      try {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currency.toUpperCase(),
        }).format(amount / 100);
      } catch {
        return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
      }
    };
  }, []);

  const formatAddress = (shippingAddress: any) => {
    if (!shippingAddress) return "N/A";
    if (typeof shippingAddress === "string") return shippingAddress;
    const parts = [
      shippingAddress.line1,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postal_code,
      shippingAddress.country,
    ]
      .filter(Boolean)
      .join(", ");
    return parts || "N/A";
  };

  // ✅ UI states
  if (loading) return <p style={{ padding: 16 }}>Loading your orders…</p>;
  if (error) return <p style={{ color: "red", padding: 16 }}>Error: {error}</p>;
  if (!orders.length)
    return <p style={{ padding: 16 }}>No orders found for {userEmail}.</p>;

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Order History</h2>

      <ul className={styles.list}>
        {orders.map((order) => {
          const shippingDisplay = formatAddress(order.shippingAddress);
          const isOpen = expanded === order.id;

          return (
            <li key={order.id} className={styles.card}>
              <button
                type="button"
                className={`${styles.headerBtn} ${
                  isOpen ? styles.headerBtnOpen : ""
                }`}
                onClick={() => setExpanded(isOpen ? null : order.id)}
                aria-expanded={isOpen}
                aria-controls={`order-panel-${order.id}`}
              >
                <div className={styles.headerLeft}>
                  <Package className={styles.pkgIcon} size={24} aria-hidden="true" />
                  <div className={styles.headerText}>
                    <p className={styles.orderLabel}>Order {order.id.slice(-6)}</p>
                    <p className={styles.meta}>
                      {formatAmount(order.amount, order.currency)} •{" "}
                      {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      <span className={styles.badge}>{order.status}</span>
                    </p>
                  </div>
                </div>

                <span className={styles.chev} aria-hidden="true">
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </span>
              </button>

              {/* ✅ Expanded Order Details */}
              {isOpen && (
                <div
                  id={`order-panel-${order.id}`}
                  className={styles.details}
                  role="region"
                  aria-label={`Order ${order.id.slice(-6)} details`}
                >
                  <p>
                    <strong>Device:</strong> {order.device || "N/A"}
                  </p>
                  <p>
                    <strong>Shipping:</strong> {shippingDisplay}
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

                  {/* 🧾 Line Items Section */}
                  {order.items?.length ? (
                    <div className={styles.itemsSection}>
                      <h4 className={styles.itemsTitle}>Items Purchased</h4>
                      <ul className={styles.itemList}>
                        {order.items.map((item, index) => (
                          <li key={index} className={styles.itemRow}>
                            <span className={styles.itemDesc}>{item.description}</span>
                            <span className={styles.itemQty}>×{item.quantity}</span>
                            <span className={styles.itemPrice}>
                              {formatAmount(item.amount_total, item.currency)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No item details available.</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
