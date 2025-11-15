import styles from "./BuyNowButton.module.css";
import React, { useCallback, useMemo, useState, useEffect } from "react";

type UserSettingsResponse = { Device?: string };

// ✅ Same structure used in Signup — shortened list for now
const deviceOptions: Record<string, string[]> = {
  iPhone: [
    "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
    "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15"
  ],
  Samsung: [
    "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25",
    "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24"
  ],
  Google: [
    "Pixel 10 Pro Fold", "Pixel 10 Pro XL", "Pixel 10 Pro", "Pixel 10",
    "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9"
  ]
};

// ✅ JWT Decoder remains unchanged
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
  { id: "bowl", label: "Bowl" }
];

export function BuyNowButton() {
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // ✅ Modal state
  const [confirmModal, setConfirmModal] = useState(false);
  const [brand, setBrand] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [caseLink, setCaseLink] = useState("");

  const apiBase = useMemo(() => {
    const raw = process.env.REACT_APP_BACKEND_API_URL || "";
    return raw.endsWith("/") ? raw : raw ? `${raw}/` : "";
  }, []);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleCheckout = useCallback(async () => {
    setError(null);

    if (selectedItems.length === 0) {
      setError("Please select at least one item.");
      return;
    }

    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      window.location.href = "/login";
      return;
    }

    const user = decodeJwtPayload(idToken);
    if (!user?.email) {
      setError("Please re-login.");
      return;
    }

    // ✅ Ask user which device — always use modal
    setConfirmModal(true);
  }, [selectedItems]);

  const confirmAndCheckout = async () => {
    if (!brand || !deviceModel) {
      setError("Please select your device.");
      return;
    }

    setConfirmModal(false);
    setProcessingCheckout(true);

    try {
      const idToken = localStorage.getItem("idToken")!;
      const user = decodeJwtPayload(idToken);
      const userEmail = user?.email;

      const items = selectedItems.map((id) => ({ id, quantity: 1 }));

      const res = await fetch(`${apiBase}api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          device: `${brand} ${deviceModel}`,
          caseLink: caseLink || "No Case Provided",
          items
        })
      });

      const data = await res.json();
      if (data?.url) window.location.assign(data.url);
      else throw new Error();
    } catch {
      setError("Checkout failed. Try again.");
    } finally {
      setProcessingCheckout(false);
    }
  };

  return (
    <>
      <div className={styles.buyNowWrapper}>
        {/* ✅ Item selection */}
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

        {/* ✅ CTA Button */}
        <button
          className={styles.buyBtn}
          onClick={handleCheckout}
          disabled={processingCheckout}
        >
          {processingCheckout
            ? "Processing…"
            : selectedItems.length > 0
            ? `Buy ${selectedItems.join(", ")}`
            : "Buy Now"}
        </button>

        {error && <p className={styles.errorMsg}>{error}</p>}
      </div>

      {/* ✅ Confirmation Modal */}
      {confirmModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h3>Confirm your device</h3>

            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setDeviceModel("");
              }}
              className={styles.input}
            >
              <option value="">Select brand…</option>
              {Object.keys(deviceOptions).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            {brand && (
              <select
                value={deviceModel}
                onChange={(e) => setDeviceModel(e.target.value)}
                className={styles.input}
              >
                <option value="">Select model…</option>
                {deviceOptions[brand].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            )}

            <div className={styles.caseInputGroup}>
              <label htmlFor="caseLink" className={styles.caseLabel}>
                Case Link (optional)
              </label>

              <input
                id="caseLink"
                type="url"
                className={styles.caseInput}
                placeholder="Paste a link to the case you use (Amazon, OtterBox, etc.)"
                value={caseLink}
                onChange={(e) => setCaseLink(e.target.value)}
                inputMode="url"
              />

              <p className={styles.caseHelpText}>
                If you use a protective case, this helps us ensure the perfect fit.
              </p>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setConfirmModal(false)} className={styles.cancelBtn}>
                Cancel
              </button>
              <button
                onClick={confirmAndCheckout}
                className={styles.confirmBtn}
                disabled={!brand || !deviceModel}
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
