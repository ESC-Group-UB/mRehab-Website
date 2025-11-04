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
  amount: number | null;
  currency: string | null;
  status: string;
  device?: string;
  caseLink?: string;
  shippingAddress: any;
  phone: string | null;
  shippingStatus: string;
  createdAt: string;
  items?: OrderItem[];
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

  // Decode user
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

  // Fetch orders
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

        // ✅ Sort newest → oldest
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

    return [
      shippingAddress.line1,
      shippingAddress.city,
      shippingAddress.state,
      shippingAddress.postal_code,
      shippingAddress.country,
    ]
      .filter(Boolean)
      .join(", ") || "N/A";
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

              {isOpen && (
                <div className={styles.details}>
                  <p>
                    <strong>Device:</strong> {order.device || "N/A"}
                  </p>

                  <p>
                    <strong>Case:</strong>{" "}
                    {order.caseLink ? (
                      <a
                        href={order.caseLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        View Case Link
                      </a>
                    ) : (
                      "No case on file"
                    )}
                  </p>

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

                  {order.items?.length ? (
                    <div className={styles.itemsSection}>
                      <h4 className={styles.itemsTitle}>Items</h4>
                      <ul className={styles.itemList}>
                        {order.items.map((item, idx) => (
                          <li key={idx} className={styles.itemRow}>
                            <span>{item.description}</span>
                            <span>×{item.quantity}</span>
                            <span>
                              {formatAmount(
                                item.amount_total,
                                item.currency
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No item data available.</p>
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
