import React, { FC, useState } from "react";
import DetailsSection from "./DetailsSection";
import styles from "./ProductInfo.module.css";
// import { BuyNowButton } from "../BuyNow/BuyNowButton";
import { Product } from "../Shopping/Prodcuts";



interface Props {
  product: Product;
}

export interface CartItem {
  product: Product;
  color: string;
  weight: string;
  quantity: number;
  device?: string;
}

const CART_KEY = "mrehab_cart";

function getCartFromLocalStorage(): CartItem[] {
  if (typeof window === "undefined") return []; // SSR safety (Next.js, etc.)

  const raw = window.localStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as CartItem[];
  } catch {
    // If something is corrupted, start fresh
    return [];
  }
}

function saveCartToLocalStorage(cart: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

const ProductInfo: FC<Props> = ({ product }) => {
  const [color, setColor] = useState<string>("Black");
  const [weight, setweight] = useState<string>("Light");
  const [quantity, setQuantity] = useState<number>(1);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const onAddToCart = () => {
    const newCartItem: CartItem = {
      product,
      color,
      weight,
      quantity,
    };

    // 1. Get existing cart
    const cart = getCartFromLocalStorage();

    // 2. Check if this exact product/color/weight combo already exists
    const existingIndex = cart.findIndex(
      (item) =>
        // adjust this if Product uses a different unique field than `id`
        item.product.id === newCartItem.product.id &&
        item.color === newCartItem.color &&
        item.weight === newCartItem.weight
    );

    if (existingIndex !== -1) {
      // 3a. If it exists, bump quantity
      cart[existingIndex] = {
        ...cart[existingIndex],
        quantity: cart[existingIndex].quantity + newCartItem.quantity,
      };
    } else {
      // 3b. Otherwise, add as a new line item
      cart.push(newCartItem);
    }

    // 4. Save back to localStorage
    saveCartToLocalStorage(cart);

    // Optional: feedback
    // toast / snackbar / console.log
    console.log("Added to cart:", newCartItem);
  };

  return (
    <aside className={styles.rightInfo} aria-label="Product information">
      {/* Product Name */}
      <h1 className={styles.title}>{product.name}</h1>

      {/* Price */}
      <p className={styles.price} aria-label="Price">
        ${product.price.toFixed(2)}
      </p>

      {/* Description */}
      <p className={styles.desc}>
        {product.description ??
          "Experience full recovery powered by our established mRehab toolkit."}
      </p>

      {/* ---------- COLOR + QUANTITY IN A ROW ---------- */}
      <div className={styles.selectorRow}>
        {/* Color Selector */}
        <div className={styles.selectorBlock}>
          <label className={styles.selectorLabel}>Color</label>
          <select
            className={styles.dropdown}
            value={color}
            onChange={(e) => setColor(e.target.value)}
          >
            <option value="Black">Black</option>
            <option value="Color 2">Color 2</option>
            <option value="Color 3">Color 3</option>
          </select>
        </div>

        {/* Weight Selector */}
        <div className={styles.selectorBlock}>
          <label className={styles.selectorLabel}>Weight</label>
          <select
            className={styles.dropdown}
            value={weight}
            onChange={(e) => setweight(e.target.value)}
          >
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Heavy">Heavy</option>
          </select>
        </div>

        {/* Quantity Selector */}
        <div className={styles.selectorBlock}>
          <label className={styles.selectorLabel}>Quantity</label>

          <div className={styles.qtyWrapper}>
            <button
              type="button"
              className={styles.qtyButton}
              onClick={decreaseQty}
            >
              –
            </button>

            <span className={styles.qtyValue}>{quantity}</span>

            <button
              type="button"
              className={styles.qtyButton}
              onClick={increaseQty}
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Buy Button */}
      <div className={styles.buyButtonWrapper}>
        <div>
          <button
            style={{
              background: "linear-gradient(90deg, #ff4d8d, #ff2e63)",
              border: "none",
              padding: "14px 26px",
              color: "white",
              fontSize: "18px",
              fontWeight: 600,
              borderRadius: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 6px 16px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 4px 10px rgba(0,0,0,0.15)";
            }}
            onClick={onAddToCart}
          >
            Add To Cart
          </button>
        </div>
        {/* <BuyNowButton /> */}
      </div>

      {/* Details */}
      <DetailsSection
        title="Details"
        content={
          product.details ??
          "Includes custom-fit rehab tools designed to support common therapy goals."
        }
      />

      {/* Mobile Sticky Buy Bar (currently disabled) */}
      {/* <div className={styles.stickyBar} role="region" aria-label="Buy now">
        <div className={styles.stickyInner}>
          <span className={styles.stickyPrice}>
            ${product.price.toFixed(2)}
          </span>
          <BuyNowButton />
        </div>
      </div> */}
    </aside>
  );
};

export default ProductInfo;
