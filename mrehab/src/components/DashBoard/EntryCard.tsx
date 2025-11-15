import styles from "./EntryCard.module.css";

type Props = {
  entry: any;
};

export default function EntryCard({ entry }: Props) {
  const formattedTime = new Date(entry.Timestamp).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedDuration = entry.Duration
    ? `${entry.Duration.toFixed(1)} sec`
    : "N/A";

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>{entry.ExerciseName}</h3>
        <span className={styles.timestamp}>{formattedTime}</span>
      </div>

      {/* Performance */}
      <div className={styles.section}>
        <p><strong>Accuracy:</strong> {entry.Accuracy}%</p>
        <p><strong>Repetitions:</strong> {entry.Reps}</p>
        <p><strong>Duration:</strong> {formattedDuration}</p>

        {entry.ActivitySpecificData?.incorrectPresses !== undefined && (
          <p><strong>Incorrect Presses:</strong> {entry.ActivitySpecificData.incorrectPresses}</p>
        )}

        <p><strong>Hand:</strong> {entry.Hand}</p>
      </div>


      {/* Status Tags */}
      {/* <div className={styles.tagRow}>
        {entry.Reviewed && (
          <span className={`${styles.tag} ${styles.tagReviewed}`}>Reviewed</span>
        )}

        {entry.Accuracy < 70 && (
          <span className={`${styles.tag} ${styles.tagWarning}`}>Low Accuracy</span>
        )}
      </div> */}
    </div>
  );
}
