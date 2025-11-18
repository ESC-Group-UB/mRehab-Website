import React, { FC } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";

export const ShoppingTopBar: FC = () => {
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

        {/* SEARCH BAR */}
        <div style={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search"
            style={styles.searchInput}
          />

          <span style={styles.searchIcon}>
            {FiSearch({})}
          </span>
        </div>

        {/* CART ICON */}
        <span style={styles.cartIcon}>
          {FiShoppingCart({})}
        </span>

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

  /* SEARCH */
  searchWrapper: {
    position: "relative",
    width: "280px",
  },

  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 15px",
    borderRadius: "25px",
    border: "1px solid #b7b7b7",
    fontSize: "16px",
    outline: "none",
  },

  searchIcon: {
    position: "absolute",
    right: "14px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "20px",
    color: "#555",
  },

  /* CART ICON */
  cartIcon: {
    fontSize: "30px",
    cursor: "pointer",
  },
};
