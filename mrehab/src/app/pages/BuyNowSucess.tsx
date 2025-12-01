import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { CheckCircle } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import styles from "./BuyNowSucess.module.css";

export default function BuyNowSuccess() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [role, setRole] = useState<"provider" | "patient" | null>(null);
  const [name, setName] = useState<string | null>(null);

  const handleSignOut = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  // Decode user + role
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

  // Read session id from query
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

  // clear cart on sucessful purchase
  useEffect(() => {
    localStorage.removeItem("mrehab_cart");
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.wrap}>
          <section className={styles.card} aria-labelledby="success-title">
            <div className={styles.icon} aria-hidden="true">
              <CheckCircle size={64} />
            </div>

            <h1 id="success-title" className={styles.title}>
              Purchase Successful!
            </h1>

            <p className={styles.lead}>
              🎉 Thank you for your order{ name ? `, ${name}` : "" }. A receipt has been sent to your email.
            </p>
            <p className={styles.sub}>
              You can view your order details anytime in your{" "}
              <a
                className={styles.link}
                href={role === "provider" ? "/provider-dashboard" : "/patient-dashboard"}
              >
                dashboard
              </a>
              .
            </p>

            <div className={styles.summary} role="group" aria-label="Order summary">
              <h2 className={styles.summaryTitle}>Order Summary</h2>
              <p className={styles.row}>
                <strong>Order ID:</strong>{" "}
                <span aria-live="polite">{sessionId || "Loading…"}</span>
              </p>
              <p className={styles.row}>
                <strong>Status:</strong> Paid ✅
              </p>
            </div>

            <button
              type="button"
              onClick={redirectDashboard}
              className={styles.cta}
            >
              Go to Dashboard
            </button>

            {/* Live region for any dynamic status in the future */}
            <p className={styles.live} aria-live="polite" />
          </section>
        </div>
      </main>
    </>
  );
}
