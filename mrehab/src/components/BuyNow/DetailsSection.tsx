import React from "react";
import styles from "./DetailsSection.module.css";

type Props = {
  title: string;
  content: string;
};

export default function DetailsSection({ title, content }: Props) {
  return (
    <div className={styles.section}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.content}>{content}</p>
    </div>
  );
}
