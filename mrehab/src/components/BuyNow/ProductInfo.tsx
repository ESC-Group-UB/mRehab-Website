import React, { FC, useState } from "react";
import DetailsSection from "./DetailsSection";
import styles from "./ProductInfo.module.css";
// import { BuyNowButton } from "../BuyNow/BuyNowButton";
import { Product } from "../Shopping/Prodcuts";

interface Props {
  product: Product;
}

const ProductInfo: FC<Props> = ({ product }) => {
  const [color, setColor] = useState<string>("Default");
  const [Weight, setWeight] = useState<string>("Default");
  const [quantity, setQuantity] = useState<number>(1);

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

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

        <div className={styles.selectorBlock}>
          <label className={styles.selectorLabel}>Weight</label>
          <select
            className={styles.dropdown}
            value={Weight}
            onChange={(e) => setWeight(e.target.value)}
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
              (e.currentTarget.style.transform = "scale(1.05)");
              (e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)");
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.transform = "scale(1)");
              (e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)");
            }}
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

      {/* Mobile Sticky Buy Bar */}
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
