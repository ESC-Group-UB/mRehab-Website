import styles from "./BuyNowButton.module.css";
import React, { useCallback, useMemo, useState } from "react";

type UserSettingsResponse = { Device?: string };

// Helper: JWT payload (base64url) safe decode
function decodeJwtPayload(idToken: string): any | null {
  try {
    const payload = idToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
    return JSON.parse(atob(base64 + pad));
  } catch {
    return null;
  }
}

export function BuyNowButton() {
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = useMemo(() => {
    const raw = process.env.REACT_APP_BACKEND_API_URL || "";
    return raw.endsWith("/") ? raw : raw ? `${raw}/` : "";
  }, []);

  const handleCheckout = useCallback(async () => {
    if (processingCheckout) return; // guard against rapid taps
    setError(null);

    // 1) Check login
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
      return;
    }

    // 2) Decode user
    const user = decodeJwtPayload(idToken);
    if (!user) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
      return;
    }

    const userEmail: string = user.email || "";
    const device: string = user.Device || "";

    if (!userEmail) {
      setError("User email is missing. Please re-login.");
      return;
    }

    setProcessingCheckout(true);

    try {
      // 3) Optionally fetch device info from backend
      let finalDevice = device;
      if (!finalDevice) {
        try {
          const res = await fetch(`${apiBase}api/aws/user-settings?email=${encodeURIComponent(userEmail)}`);
          if (res.ok) {
            const data: UserSettingsResponse = await res.json();
            finalDevice = data?.Device ?? "No device on file";
          }
        } catch (err) {
          console.warn("⚠️ Could not fetch device info:", err);
        }
      }

      // 4) Create Stripe checkout session
      const res = await fetch(`${apiBase}api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, device: finalDevice }),
      });

      if (!res.ok) throw new Error(`Checkout failed with status ${res.status}`);
      const data = await res.json();

      if (data?.url) {
        window.location.assign(data.url);
      } else {
        throw new Error("No URL returned from backend");
      }
    } catch (err: any) {
      console.error("Error initiating checkout:", err);
      setError("Could not start checkout. Please try again.");
    } finally {
      setProcessingCheckout(false);
    }
  }, [apiBase, processingCheckout]);

  return (
    <>
      <button
        className={styles.buyBtn}
        onClick={handleCheckout}
        disabled={processingCheckout}
        aria-busy={processingCheckout}
        aria-live="polite"
      >
        {processingCheckout ? "Processing…" : "Buy Now"}
      </button>
      {error && <p className={styles.errorMsg}>{error}</p>}
    </>
  );
}
