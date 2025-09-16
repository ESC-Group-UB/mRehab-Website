import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { CheckCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";

export default function BuyNowSuccess() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [role, setRole] = useState<"provider" | "patient" | null>(null);
  const [name, setName] = useState<string | null>(null);

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
      const groups: string[] = decoded["cognito:groups"] || [];

      if (groups.some((g) => g.toLowerCase() === "provider")) {
        setRole("provider");
      } else {
        setRole("patient");
      }

      setName(decoded.given_name || decoded.name || "User");
    } catch (err) {
      console.error("❌ Error decoding token", err);
      handleSignOut();
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("session_id");
    if (id) setSessionId(id);
  }, []);

  const redirectDashboard = () => {
    if (role === "provider") {
      window.location.href = "/provider-dashboard";
    } else {
      window.location.href = "/patient-dashboard";
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: "600px",
          margin: "60px auto",
          padding: "2rem",
          textAlign: "center",
          border: "1px solid #e0e0e0",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <CheckCircle size={64} color="green" style={{ marginBottom: "16px" }} />

        <h2 style={{ fontSize: "1.8rem", marginBottom: "12px" }}>
          Purchase Successful!
        </h2>

        <p style={{ fontSize: "1rem", marginBottom: "8px" }}>
          🎉 Thank you for your order {name}. A receipt has been sent to your
          email.
        </p>
        <p style={{ fontSize: "0.95rem", color: "#555", marginBottom: "24px" }}>
          You can view your order details anytime in your{" "}
          <a
            href={role === "provider" ? "/provider-dashboard" : "/patient-dashboard"}
            style={{ color: "var(--color-main)" }}
          >
            dashboard
          </a>
          .
        </p>

        <div
          style={{
            background: "#fafafa",
            padding: "1rem",
            borderRadius: "8px",
            marginBottom: "24px",
            textAlign: "left",
          }}
        >
          <h3 style={{ marginBottom: "8px" }}>Order Summary</h3>
          <p>
            <strong>Order ID:</strong> {sessionId || "Loading..."}
          </p>
          <p>
            <strong>Status:</strong> Paid ✅
          </p>
        </div>

        <button
          onClick={redirectDashboard}
          style={{
            backgroundColor: "var(--color-main, #2a6df4)",
            color: "#fff",
            padding: "0.9rem 1.8rem",
            fontSize: "1rem",
            fontWeight: 600,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </>
  );
}
