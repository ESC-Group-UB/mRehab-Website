import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ChevronDown, ChevronUp, Package } from "lucide-react";

type Order = {
  id: string;
  email: string | null;
  amount: number | null;
  currency: string | null;
  status: string;
  device?: string;
  shippingAddress: any; // can be string or object
  phone: string | null;
  shippingStatus: string;
  createdAt: string;
};

export default function OrdersHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleSignOut = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

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

  useEffect(() => {
    async function fetchOrders() {
      if (!userEmail) return;
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://localhost:5000/api/orders/byEmail?email=${encodeURIComponent(
            userEmail
          )}`
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [userEmail]);

  if (loading) return <p>Loading your orders…</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!orders.length) return <p>No orders found for {userEmail}.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        Order History
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {orders.map((order) => {
          let shippingDisplay = "N/A";
          if (typeof order.shippingAddress === "string") {
            shippingDisplay = order.shippingAddress;
          } else if (order.shippingAddress?.line1) {
            shippingDisplay = `${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.postal_code}, ${order.shippingAddress.country}`;
          }

          const isOpen = expanded === order.id;

          return (
            <li
              key={order.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                marginBottom: "12px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
            >
              <div
                onClick={() =>
                  setExpanded(isOpen ? null : order.id)
                }
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  cursor: "pointer",
                  backgroundColor: isOpen ? "#f9f9f9" : "#fff",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Package size={24} color="var(--color-main, #2a6df4)" />
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>
                      Order {order.id.slice(-6)} {/* show short ID */}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                      {order.amount
                        ? `${order.amount / 100} ${order.currency?.toUpperCase()}`
                        : "N/A"}{" "}
                      • {new Date(order.createdAt).toLocaleDateString()} •{" "}
                      {order.status}
                    </p>
                  </div>
                </div>
                {isOpen ? <ChevronUp /> : <ChevronDown />}
              </div>

              {isOpen && (
                <div style={{ padding: "16px", background: "#fafafa" }}>
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
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
