import React from "react";
import styles from "./DetailsSection.module.css";

type Props = {
  title: string;
  content: string;
  /** Optionally start collapsed (defaults to open) */
  defaultOpen?: boolean;
};

export default function DetailsSection({ title, content, defaultOpen = true }: Props) {
  return (
    <details className={styles.section} open={defaultOpen}>
      <summary className={styles.title}>
        <span className={styles.titleText}>{title}</span>
        <svg
          className={styles.chevron}
          width="16"
          height="16"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M6 8l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </summary>
      <p className={styles.content}>{content}</p>
    </details>
  );
}
