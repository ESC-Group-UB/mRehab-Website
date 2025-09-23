import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Navbar } from "../../components/Navbar";
import FiltersBar from "../../components/DashBoard/FiltersBar";
import AccuracyGraph from "../../components/AccuracyGraph";
import AddViewer from "../../components/DashBoard/addViewer";
import ResultsSection from "../../components/DashBoard/ResultsSection";
import OrdersHistory from "../../components/DashBoard/OrderHistory";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;

export default function PatientDashboard() {
  const [entries, setEntries] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterHand, setFilterHand] = useState("");
  const [filterExercise, setFilterExercise] = useState("");
  const [filterStartDate, setStartDate] = useState("");
  const [filterEndDate, setEndDate] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [name, setName] = useState("");
  const [hover, setHover] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return handleSignOut();

    try {
      const decoded: any = jwtDecode(idToken);
      const groups = decoded["cognito:groups"] || [];

      if (!groups.includes("Patient") && !groups.includes("patient")) {
        alert("You are not authorized to view this page.");
        return handleSignOut();
      }

      setUserEmail(decoded.email);
      setName(decoded.given_name);
    } catch (err) {
      console.error("❌ Error decoding token", err);
      handleSignOut();
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchEntries = async () => {
      try {
        setError(null);
        const params = new URLSearchParams();
        params.append("username", userEmail);
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
  }, [userEmail, filterHand, filterExercise, filterStartDate, filterEndDate]);

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px", maxWidth: "1000px", margin: "0 auto" }}>
        <h1>Welcome {name}</h1>

        <OrdersHistory />

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
          <ResultsSection entries={entries} selectedPatient={userEmail} />
        ) : (
          <p>No entries found for your account.</p>
        )}

        <hr style={{ margin: "40px 0" }} />
        <AddViewer />
        {/* button to sign out */}
      <button
        onClick={handleSignOut}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          marginTop: "20px",
          backgroundColor: hover ? "var(--color-main-hover)" : "var(--color-main)",
          color: "var(--color-white)",
          padding: "0.9rem 1.8rem",
          fontWeight: 600,
          fontSize: "1rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
      >
        Sign Out
      </button>
      </div>
    </>
  );
}
