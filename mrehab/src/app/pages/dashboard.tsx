import React, { useState } from "react";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterHand, setFilterHand] = useState("");
  const [filterStartDate, setStartDate] = useState("");
  const [filterEndDate, setEndDate] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) {
      setError("Please enter a username.");
      return;
    }

    try {
      setError(null);
      const res = await fetch(
        `http://localhost:5000/api/aws/byUserName?username=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unknown error");

      let filtered = data.entries;

      if (filterHand) {
        filtered = filtered.filter((entry: any) => entry.Hand === filterHand);
      }

      if (filterStartDate) {
        filtered = filtered.filter((entry: any) =>
          new Date(entry.Timestamp) >= new Date(filterStartDate)
        );
      }

      if (filterEndDate) {
        filtered = filtered.filter((entry: any) =>
          new Date(entry.Timestamp) <= new Date(filterEndDate)
        );
      }

      setEntries(filtered);
    } catch (err: any) {
      console.error("❌ Error fetching entries:", err);
      setError(err.message || "Failed to fetch entries.");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>📊 mRehab Dashboard</h1>
      <p style={{ marginBottom: "20px" }}>
        Search and filter activity sessions by username.
      </p>

      <form onSubmit={handleSubmit} style={{ marginBottom: "30px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <input
          type="text"
          placeholder="Enter username"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "8px", flex: "1 1 200px" }}
        />

        <select
          value={filterHand}
          onChange={(e) => setFilterHand(e.target.value)}
          style={{ padding: "8px", flex: "1 1 120px" }}
        >
          <option value="">All Hands</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
        </select>

        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ padding: "8px", flex: "1 1 150px" }}
        />

        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ padding: "8px", flex: "1 1 150px" }}
        />

        <button type="submit" style={{ padding: "8px 20px", backgroundColor: "#4f46e5", color: "#fff", border: "none" }}>
          Search
        </button>
      </form>

      {error && <p style={{ color: "red", marginBottom: "20px" }}>⚠️ {error}</p>}

      {entries.length > 0 ? (
        <div>
          <h2 style={{ marginBottom: "10px" }}>Results for <strong>{searchTerm}</strong></h2>
          <div style={{ display: "grid", gap: "15px" }}>
            {entries.map((entry, index) => (
              <div key={index} style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}>
                <h3 style={{ margin: "0 0 8px" }}>{entry.ExerciseName}</h3>
                <p style={{ margin: 0 }}>🕒 <strong>{new Date(entry.Timestamp).toLocaleString()}</strong></p>
                <p style={{ margin: 0 }}>✅ Accuracy: {entry.Accuracy}</p>
                <p style={{ margin: 0 }}>🤚 Hand: {entry.Hand}</p>
                <p style={{ margin: 0 }}>🔁 Reps: {entry.Reps}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        searchTerm && <p>No entries found.</p>
      )}
    </div>
  );
}
