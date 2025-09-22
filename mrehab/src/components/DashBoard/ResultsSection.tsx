import React from "react";
import EntryCard from "./EntryCard";
import styles from "./ResultsSection.module.css";

type Props = {
  entries: any[];
  selectedPatient: string;
};

export default function ResultsSection({ entries, selectedPatient }: Props) {
  return (
    <section className={styles.wrap} aria-label="Results">
      <div className={styles.container}>
        <h2 className={styles.title}>
          Results for <strong className={styles.patient}>{selectedPatient}</strong>
        </h2>

        {/* Empty state (optional but helpful on mobile) */}
        {(!entries || entries.length === 0) ? (
          <p style={{ color: "#555", margin: "8px 0 0" }}>
            No entries to display.
          </p>
        ) : (
          <div className={styles.grid}>
            {entries.map((entry, index) => (
              <EntryCard key={index} entry={entry} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
