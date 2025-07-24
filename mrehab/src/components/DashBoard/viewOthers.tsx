import React, { useEffect, useState } from "react";
import axios from "axios";

export function ViewOthers({
  onSelectPatient,
}: {
  onSelectPatient: (email: string) => void;
}) {
  const api = "api/authorizedUsers/getAllowedToViewUsers";
  const [viewers, setViewers] = useState<string[]>([]);

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    const baseURL = process.env.REACT_APP_BACKEND_API_URL;
    if (!idToken) return;

    const decoded = JSON.parse(atob(idToken.split(".")[1]));
    const email = decoded.email;

    axios
      .get(`${baseURL}${api}`, {
        params: { username: email },
      })
      .then((res) => {
        setViewers(res.data);
        console.log("✅ Fetched patients:", res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch patients:", err);
      });
  }, []);

  return (
    <div style={{ marginTop: "20px", marginBottom: "20px" }}>
      <label htmlFor="patientSelect" style={{ marginRight: "10px" }}>
        Select a patient:
      </label>
      <select
        id="patientSelect"
        onChange={(e) => onSelectPatient(e.target.value)}
        style={{ padding: "8px", width: "250px" }}
      >
        <option value="">-- Choose a patient --</option>
        {viewers.map((viewer, idx) => (
          <option key={idx} value={viewer}>
            {viewer}
          </option>
        ))}
      </select>
    </div>
  );
}
