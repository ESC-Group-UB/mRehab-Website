import React from "react";
import styles from "./SplitSection.module.css";

type Props = {
  title: string;
  description?: string;
  imageSrc: string;
  imageOnLeft?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
};

export default function SplitSection({
  title,
  description,
  imageSrc,
  imageOnLeft = true,
  primaryButtonText,
  secondaryButtonText,
}: Props) {
  return (
    <div
      className={`${styles.container} ${
        imageOnLeft ? "" : styles.reverse
      }`}
    >
      <div className={styles.imageWrapper}>
        <img src={imageSrc} alt="section" className={styles.image} />
      </div>

      <div className={styles.textContent}>
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {(primaryButtonText || secondaryButtonText) && (
          <div className={styles.buttons}>
            {primaryButtonText && (
              <button className={styles.primary}>{primaryButtonText}</button>
            )}
            {secondaryButtonText && (
              <button className={styles.secondary}>{secondaryButtonText}</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
