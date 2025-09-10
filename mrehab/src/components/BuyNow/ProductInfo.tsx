import React from "react";
import DetailsSection from "./DetailsSection";
import styles from "./ProductInfo.module.css";

export default function ProductInfo() {
  return (
    <div className={styles.rightInfo}>
      <h1>mRehab Kit</h1>
      <p className={styles.price}>$59.00</p>
      {/* removed for demo acuracy
      <div className={styles.stars}>
        ★★★★★ <span className={styles.reviewCount}>(123 reviews)</span>
      </div> */}

      <p className={styles.desc}>
        Experience full recovery powered by our established mRehab Toolkit.
        Bundled with precision-fit 3D-printed tools and engaging AI-driven
        guidance for home rehab success.
      </p>

        {/* only have 1 version for now */}
      {/* <label htmlFor="type-select">Type</label>
      <select id="type-select">
        <option>Standard</option>
        <option>Deluxe</option>
      </select> */}

        {/*  button should direct to /buy-now/confirm */}
        <button className={styles.buyBtn} onClick={() => window.location.href = '/buy-now/confirm'}>Buy Now</button>

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
    </div>
  );
}
