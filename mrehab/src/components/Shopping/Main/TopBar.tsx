import React, { FC, useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";

const CART_KEY = "mrehab_cart";

export const ShoppingTopBar: FC = () => {
  const [cartCount, setCartCount] = useState(0);

  // Read cart from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const raw = window.localStorage.getItem(CART_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Array<{ quantity?: number }>;
      const total = parsed.reduce(
        (sum, item) => sum + (item.quantity ?? 0),
        0
      );
      setCartCount(total);
    } catch {
      // ignore parse errors
    }

    // Optional: listen for updates from other tabs or custom events
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== CART_KEY) return;
      try {
        const value = e.newValue;
        if (!value) {
          setCartCount(0);
          return;
        }
        const parsed = JSON.parse(value) as Array<{ quantity?: number }>;
        const total = parsed.reduce(
          (sum, item) => sum + (item.quantity ?? 0),
          0
        );
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const goToCart = () => {
    window.location.href = "/shopping/cart";
  };

  return (
    <div style={styles.container}>
      {/* LEFT SIDE */}
      <div style={styles.left}>
        <div style={styles.textGroup}>
          <h1 style={styles.title}>mRehab Shop</h1>
          <p style={styles.subtitle}>Order items from our catalog</p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        {/* CART ICON + BADGE */}
        <div style={styles.cartWrapper} onClick={goToCart}>
          {FiShoppingCart({ style: styles.cartIcon })}
          {cartCount > 0 && (
            <span style={styles.cartBadge}>
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

type Style = React.CSSProperties;

const styles: Record<string, Style> = {
  container: {
    width: "100%",
    padding: "30px 50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },

  /* LEFT */
  left: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  textGroup: {
    display: "flex",
    flexDirection: "column",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 600,
  },

  subtitle: {
    margin: 0,
    marginTop: "4px",
    fontSize: "14px",
    color: "#555",
  },

  /* RIGHT SIDE WRAPPER */
  right: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  /* CART WRAPPER (for badge) */
  cartWrapper: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  /* CART ICON */
  cartIcon: {
    fontSize: "30px",
  },

  /* BADGE */
  cartBadge: {
    position: "absolute",
    top: "-4px",
    right: "-8px",
    minWidth: "18px",
    height: "18px",
    padding: "0 4px",
    borderRadius: "999px",
    backgroundColor: "#ef4444",
    color: "#fff",
    fontSize: "11px", 
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0 0 2px #fff",
  },
};
