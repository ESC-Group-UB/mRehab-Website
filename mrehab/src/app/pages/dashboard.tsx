import React, { useState, useEffect } from "react";
import AccuracyGraph from "../../components/AccuracyGraph";
import { Navbar } from "../../components/Navbar";
import AddViewer from "../../components/DashBoard/addViewer";
import { ViewOthers } from "../../components/DashBoard/viewOthers";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;

export default function Dashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterHand, setFilterHand] = useState("");
  const [filterExercise, setFilterExercise] = useState("");
  const [filterStartDate, setStartDate] = useState("");
  const [filterEndDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      const user = JSON.parse(atob(idToken.split(".")[1]));
      const displayName = user.given_name || user.name || "User";
      setName(displayName);
    }
    else {
      window.location.href = "/login"; // Redirect to login if not authenticated
    }
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;

    const fetchEntries = async () => {
      try {
        setError(null);
        const params = new URLSearchParams();
        params.append("username", selectedPatient);
        if (filterHand) params.append("hand", filterHand);
        if (filterExercise) params.append("exerciseName", filterExercise);
        if (filterStartDate) params.append("start", filterStartDate);
        if (filterEndDate) params.append("end", filterEndDate);

        const res = await fetch(`${baseURL}api/aws/filtered?${params.toString()}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unknown error");
        setEntries(data.entries);
      } catch (err: any) {
        console.error("❌ Error fetching entries:", err);
        setError(err.message || "Failed to fetch entries.");
      }
    };
    fetchEntries();
  }, [selectedPatient, filterHand, filterExercise, filterStartDate, filterEndDate]);

  function handleSignout(event: React.FormEvent<HTMLButtonElement>): void {
    event.preventDefault();
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1>👨‍⚕️ Physician Dashboard</h1>
        <p>Welcome Dr. {name}</p>

        <ViewOthers onSelectPatient={setSelectedPatient} />

        {selectedPatient && (
          <>
            {/* Filters */}
            <div
              style={{
                margin: "20px 0",
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <select
                value={filterHand}
                onChange={(e) => setFilterHand(e.target.value)}
                style={{ padding: "8px", flex: "1 1 120px" }}
              >
                <option value="">All Hands</option>
                <option value="Left">Left</option>
                <option value="Right">Right</option>
              </select>

              <select
                value={filterExercise}
                onChange={(e) => setFilterExercise(e.target.value)}
                style={{ padding: "8px", flex: "1 1 180px" }}
              >
                <option value="">All Exercises</option>
                <option value="Vertical Bowl">Vertical Bowl</option>
                <option value="Horizontal Bowl">Horizontal Bowl</option>

                <option value="Horizontal Mug">Horizontal Mug</option>
                <option value="Vertical Mug">Vertical Mug</option>
                

                <option value="Sip from Mug">Sip from Mug</option>
                <option value="Quick Test Mug">Quick Test Mug</option>
                <option value="Slow Pour Mug">Slow Pour Mug</option>

                <option value="Phone Number">Phone Number</option>
                <option value="Quick Tap">Quick Tap</option>
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
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: "red", marginBottom: "20px" }}>
                ⚠️ {error}
              </p>
            )}

            {/* Accuracy Graph */}
            {entries.length > 0 && <AccuracyGraph data={entries} />}

            {/* Results */}
            {entries.length > 0 ? (
              <div style={{ marginTop: "30px" }}>
                <h2>
                  Results for <strong>{selectedPatient}</strong>
                </h2>
                <div
                  style={{
                    display: "grid",
                    gap: "15px",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  }}
                >
                  {entries.map((entry, index) => (
                    <div
                      key={index}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "16px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                        backgroundColor: "#fff",
                      }}
                    >
                      <h3>{entry.ExerciseName}</h3>
                      <p>
                        🕒 <strong>{new Date(entry.Timestamp).toLocaleString()}</strong>
                      </p>
                      <p>✅ Accuracy: {entry.Accuracy}</p>
                      <p>🤚 Hand: {entry.Hand}</p>
                      <p>🔁 Reps: {entry.Reps}</p>
                      {entry.Reviewed && (
                        <p style={{ color: "green" }}>🩺 Reviewed</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p>No entries found for this patient.</p>
            )}
          </>
        )}

        <AddViewer />
        <button onSubmit={handleSignout}>
          Signout
        </button>
      </div>
    </>
  );
}
