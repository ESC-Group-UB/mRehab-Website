import EntryCard from "./EntryCard";

type Props = {
  entries: any[];
  selectedPatient: string;
};

export default function ResultsSection({ entries, selectedPatient }: Props) {
  return (
    <div style={{ marginTop: "30px" }}>
      <h2>Results for <strong>{selectedPatient}</strong></h2>
      <div style={{
        display: "grid",
        gap: "15px",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      }}>
        {entries.map((entry, index) => (
          <EntryCard key={index} entry={entry} />
        ))}
      </div>
    </div>
  );
}