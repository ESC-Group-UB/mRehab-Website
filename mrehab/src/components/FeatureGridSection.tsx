import React from "react";
import styles from "./FeatureGridSection.module.css";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Props {
  sectionTitle: string;
  features: Feature[];
}

export default function FeatureGridSection({ sectionTitle, features }: Props) {
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{sectionTitle}</h2>
      <div className={styles.grid}>
        {features.map((feat, idx) => (
          <div key={idx} className={styles.card}>
            <img src={feat.icon} alt={feat.title} className={styles.icon} />
            <h3>{feat.title}</h3>
            <p>{feat.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
