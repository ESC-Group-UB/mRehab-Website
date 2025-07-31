import React, { useState, useEffect } from "react";
import AccuracyGraph from "../../components/AccuracyGraph";
import { Navbar } from "../../components/Navbar";
import AddViewer from "../../components/DashBoard/addViewer";
import { ViewOthers } from "../../components/DashBoard/viewOthers";
import { PatientSidebar } from "../../components/DashBoard/patientSidebar";
import FiltersBar from "../../components/DashBoard/FiltersBar";
import ResultsSection from "../../components/DashBoard/ResultsSection";

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
    console.log("🔒 Signing out...");
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <PatientSidebar
        selectedPatient={selectedPatient}
        onSelectPatient={setSelectedPatient}
      />
      <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto", flexGrow: 1 }}>
        {!selectedPatient ? (
          <>
            <h1>Welcome {name}</h1>
            <p>Select a patient in the sidebar to begin</p>
          </>
        ) : null}
        {selectedPatient && (
          <>
            <FiltersBar
              filterHand={filterHand}
              filterExercise={filterExercise}
              filterStartDate={filterStartDate}
              filterEndDate={filterEndDate}
              setFilterHand={setFilterHand}
              setFilterExercise={setFilterExercise}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />

            {error && <p style={{ color: "red", marginBottom: "20px" }}>⚠️ {error}</p>}

            {entries.length > 0 && <AccuracyGraph data={entries} />}

            {entries.length > 0 ? (
              <ResultsSection entries={entries} selectedPatient={selectedPatient} />
            ) : (
              <p>No entries found for this patient.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
