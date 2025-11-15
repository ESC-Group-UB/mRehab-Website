import React, { useState, useEffect } from "react";
import AccuracyGraph from "../../components/AccuracyGraph";
import { PatientSidebar } from "../../components/DashBoard/patientSidebar";
import FiltersBar from "../../components/DashBoard/FiltersBar";
import ResultsSection from "../../components/DashBoard/ResultsSection";
import { jwtDecode } from "jwt-decode";
import ActivitiesSelector from "../../components/DashBoard/ActivitiesSelector";

import styles from "./dashboard.module.css";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;

const categories: Record<string, string[]> = {
  Bowl: ["Vertical Bowl", "Horizontal Bowl"],
  Mug: [
    "Vertical Mug",
    "Horizontal Mug",
    "Sip from Mug",
    "Quick Test Mug",
    "Slow Pour Mug",
  ],
  Other: ["Phone Number", "Quick Tap"],
};

export default function Dashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterHand, setFilterHand] = useState("");
  const [filterExercise, setFilterExercise] = useState("");
  const [filterStartDate, setStartDate] = useState("");
  const [filterEndDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [datakey, setDataKey] = useState("Accuracy");

  const handleSignOut = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      const user = JSON.parse(atob(idToken.split(".")[1]));
      const displayName = user.given_name || user.name || "User";
      const decoded: any = jwtDecode(idToken);
      const groups = decoded["cognito:groups"] || [];

      if (groups.includes("provider") || groups.includes("Provider")) {
        setName(displayName);
      } else {
        alert("You are not authorized to view this page.");
        handleSignOut();
      }
    } else {
      window.location.href = "/login";
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

  return (
    <div className={styles.dashLayout}>
      <aside className={styles.dashSidebar}>
        <PatientSidebar
          selectedPatient={selectedPatient}
          onSelectPatient={setSelectedPatient}
        />
      </aside>

      <main className={styles.dashContent}>
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
              dataKey={datakey}
              setFilterHand={setFilterHand}
              setFilterExercise={setFilterExercise}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              setDataKey={setDataKey}
            />

            {error && (
              <p style={{ color: "red", marginBottom: "20px" }}>
                ⚠️ {error}
              </p>
            )}

            {entries.length > 0 && <AccuracyGraph data={entries} dataKey={datakey} />}

            {entries.length > 0 ? (
              <ResultsSection entries={entries} selectedPatient={selectedPatient} />
            ) : (
              <p>No entries found for this patient.</p>
            )}
            <ActivitiesSelector
              patientEmail={selectedPatient}
              categories={categories}
            />
          </>
        )}
      </main>
    </div>
  );
}
 