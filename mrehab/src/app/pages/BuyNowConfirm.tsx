import React, { useCallback, useEffect, useMemo, useState } from "react";

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

export default function BuyNowConfirm() {
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [device, setDevice] = useState<string>("");
  const [loadingDevice, setLoadingDevice] = useState(false);
  const [processingCheckout, setProcessingCheckout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ensure we always have a trailing slash for baseURL
  const apiBase = useMemo(() => {
    const raw = process.env.REACT_APP_BACKEND_API_URL || "";
    return raw.endsWith("/") ? raw : raw ? `${raw}/` : "";
  }, []);

  const fetchDevice = useCallback(async (email: string) => {
    if (!apiBase) return;
    setLoadingDevice(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}api/aws/user-settings?email=${encodeURIComponent(email)}`);
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      const data: UserSettingsResponse = await res.json();
      setDevice(data?.Device ?? "No device on file");
    } catch (err: any) {
      console.error("Error fetching device:", err);
      setDevice("Unavailable");
      setError("Could not load your device info. You can still proceed.");
    } finally {
      setLoadingDevice(false);
    }
  }, [apiBase]);

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      window.location.href = "/login";
      return;
    }

    const user = decodeJwtPayload(idToken);
    if (!user) {
      // Bad token; send to login
      window.location.href = "/login";
      return;
    }

    const name: string = user.given_name || user.name || "User";
    const email: string = user.email || "";
    const phone: string = user.phone_number || "";
    // address can be a string or object depending on IdP; handle both
    const addr: string =
      (typeof user.address === "string" && user.address) ||
      (user.address?.formatted as string) ||
      "";

    setDisplayName(name);
    setUserEmail(email);
    setPhoneNumber(phone);
    setAddress(addr);
  }, []);

  useEffect(() => {
    if (userEmail) {
      void fetchDevice(userEmail);
    }
  }, [userEmail, fetchDevice]);

  const handleCheckout = useCallback(async () => {
    if (!apiBase) {
      setError("Missing backend URL. Check REACT_APP_BACKEND_API_URL.");
      return;
    }
    setProcessingCheckout(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}api/stripe/create-checkout-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, device }),
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
  }, [apiBase, userEmail, device]);

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.25rem" }}>
      <h2>Buy Now Confirmation</h2>

      <div style={{ lineHeight: 1.8, marginTop: 8 }}>
        <p><strong>Name:</strong> {displayName || "—"}</p>
        <p><strong>Email:</strong> {userEmail || "—"}</p>
        <p><strong>Phone:</strong> {phoneNumber || "—"}</p>
        <p><strong>Address:</strong> {address || "—"}</p>
        <p>
          <strong>Device:</strong>{" "}
          {loadingDevice ? "Loading..." : device || "—"}
        </p>
      </div>

      {error && (
        <p style={{ color: "#b00020", marginTop: 12 }}>{error}</p>
      )}

      <button
        onClick={handleCheckout}
        disabled={processingCheckout || !userEmail}
        style={{
          marginTop: 16,
          padding: "0.8rem 1.4rem",
          borderRadius: 8,
          fontWeight: 600,
          border: "none",
          cursor: processingCheckout ? "not-allowed" : "pointer",
          opacity: processingCheckout || !userEmail ? 0.7 : 1,
          background: "var(--color-main, #2a6df4)",
          color: "var(--color-white, #fff)",
        }}
      >
        {processingCheckout ? "Processing..." : "Proceed to Payment"}
      </button>
    </div>
  );
}
