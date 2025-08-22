type Props = {
  entry: any;
};

export default function EntryCard({ entry }: Props) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      backgroundColor: "#fff",
    }}>
      <h3>{entry.ExerciseName}</h3>
      <p>🕒 <strong>{new Date(entry.Timestamp).toLocaleString()}</strong></p>
      <p>✅ Accuracy: {entry.Accuracy}</p>
      <p>🤚 Hand: {entry.Hand}</p>
      <p>🔁 Reps: {entry.Reps}</p>
      {entry.Reviewed && <p style={{ color: "green" }}>🩺 Reviewed</p>}
    </div>
  );
}