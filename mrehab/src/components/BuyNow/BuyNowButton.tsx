import styles from "./BuyNowButton.module.css";
import React, { useCallback, useMemo, useState } from "react";

type UserSettingsResponse = { Device?: string };

// Decode JWT payload safely
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

const PRODUCTS = [
  { id: "key", label: "Key" },
  { id: "mug", label: "Mug" },
  { id: "bowl", label: "Bowl" },
];

export function BuyNowButton() {
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const apiBase = useMemo(() => {
    const raw = process.env.REACT_APP_BACKEND_API_URL || "";
    return raw.endsWith("/") ? raw : raw ? `${raw}/` : "";
  }, []);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCheckout = useCallback(async () => {
    if (processingCheckout) return;
    setError(null);

    if (selectedItems.length === 0) {
      setError("Please select at least one item to purchase.");
      return;
    }

    // 1️⃣ Ensure user is logged in
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
      return;
    }

    // 2️⃣ Decode user info
    const user = decodeJwtPayload(idToken);
    if (!user) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
      return;
    }

    const userEmail: string = user.email || "";
    if (!userEmail) {
      setError("User email is missing. Please re-login.");
      return;
    }

    setProcessingCheckout(true);

    try {
      // 3️⃣ Try to fetch device info from backend
      let finalDevice = user.Device || "";
      if (!finalDevice) {
        try {
          const res = await fetch(
            `${apiBase}api/aws/user-settings?email=${encodeURIComponent(userEmail)}`
          );
          if (res.ok) {
            const data: UserSettingsResponse = await res.json();
            finalDevice = data?.Device ?? "No device on file";
          }
        } catch (err) {
          console.warn("⚠️ Could not fetch device info:", err);
        }
      }

      // 4️⃣ Build the items payload dynamically from selected checkboxes
      const items = selectedItems.map((id) => ({ id, quantity: 1 }));

      // 5️⃣ Create Stripe checkout session
      const res = await fetch(`${apiBase}api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, device: finalDevice, items }),
      });

      if (!res.ok) throw new Error(`Checkout failed with status ${res.status}`);
      const data = await res.json();

      if (data?.url) {
        window.location.assign(data.url);
      } else {
        throw new Error("No checkout URL returned from backend");
      }
    } catch (err: any) {
      console.error("Error initiating checkout:", err);
      setError("Could not start checkout. Please try again.");
    } finally {
      setProcessingCheckout(false);
    }
  }, [apiBase, processingCheckout, selectedItems]);

  return (
    <div className={styles.buyNowWrapper}>
      {/* ✅ Checkbox selection */}
      <div className={styles.checkboxGroup}>
        {PRODUCTS.map((product) => (
          <label key={product.id}>
            <input
              type="checkbox"
              checked={selectedItems.includes(product.id)}
              onChange={() => toggleItem(product.id)}
            />
            {product.label}
          </label>
        ))}
      </div>

      {/* 🛒 Buy Now button */}
      <button
        className={styles.buyBtn}
        onClick={handleCheckout}
        disabled={processingCheckout}
        aria-busy={processingCheckout}
        aria-live="polite"
      >
        {processingCheckout
          ? "Processing…"
          : selectedItems.length > 0
          ? `Buy ${selectedItems.join(", ")}`
          : "Buy Now"}
      </button>

      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
