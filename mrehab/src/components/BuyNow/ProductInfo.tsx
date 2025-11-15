import React from "react";
import DetailsSection from "./DetailsSection";
import styles from "./ProductInfo.module.css";
import { BuyNowButton } from "../BuyNow/BuyNowButton";

export default function ProductInfo() {
  return (
    <aside className={styles.rightInfo} aria-label="Product information">
      <h1 className={styles.title}>mRehab Kit</h1>
      <p className={styles.price} aria-label="Price">$35.00</p>

      <p className={styles.desc}>
        Experience full recovery powered by our established mRehab Toolkit.
        Bundled with precision-fit 3D-printed tools and engaging AI-driven
        guidance for home rehab success.
      </p>

      {/* Desktop / tablet buy button (hidden on mobile, where we show a sticky bar) */}
      <div className={styles.inlineBuy}>
        <BuyNowButton />
      </div>

      <DetailsSection
        title="Details"
        content="Includes 2 custom-fit devices designed to support common therapy goals, 1 Quickstart Guide, access to our mobile app, and a storage case."
      />
      <DetailsSection
        title="App Features"
        content="Our app offers AI guided feedback to enhance your therapy experience, progress visualization, and smart alerts tailored to your usage."
      />
      <DetailsSection
        title="Returns"
        content="Because each mRehab kit is made specifically for your needs, we do not offer returns or exchanges."
      />

      {/* Mobile sticky Buy bar */}
      <div className={styles.stickyBar} role="region" aria-label="Buy now">
        <div className={styles.stickyInner}>
          <span className={styles.stickyPrice}>$35.00</span>
          <BuyNowButton />
        </div>
      </div>
    </aside>
  );
}
