import React, { useState, useEffect } from "react";
import axios from "axios";

type Doctor = {
  name: string;
  email: string;
};

export default function AddViewer() {
  const baseURL = process.env.REACT_APP_BACKEND_API_URL;
  const addAPI = "api/authorizedUsers/addAuthorizedUser";
  const searchAPI = "api/authorizedUsers/search";

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const baseURL = process.env.REACT_APP_BACKEND_API_URL;
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      axios
        .get(`${baseURL}${searchAPI}`, {
          params: { query: searchTerm },
        })
        .then((res) => {
          setSearchResults(res.data || []);
        })
        .catch((err) => {
          console.error("❌ Search failed:", err);
        });
    }, 300); // debounce 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleAddViewer = async (email: string) => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;

    const decoded = JSON.parse(atob(idToken.split(".")[1]));
    const currentUserEmail = decoded.email;

    try {
      await axios.post(`${baseURL}${addAPI}`, {
        username: currentUserEmail,
        authorizedUser: email,
      });
      setStatusMessage(`✅ Added ${email}`);
      setSearchTerm("");
      setSearchResults([]);
    } catch (err: any) {
      console.error("❌ Failed to add viewer:", err);
      setStatusMessage(`❌ Could not add ${email}`);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Add Your Doctor As An Authorized User</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search doctors by name or email"
        style={{ padding: "10px", width: "100%", maxWidth: "400px", borderRadius: "6px", border: "1px solid #ccc" }}
      />

      {searchResults.length > 0 && (
        <ul style={{
          marginTop: "0.5rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          maxWidth: "400px",
          background: "#fff",
          listStyle: "none",
          padding: 0
        }}>
          {searchResults.map((doc, index) => (
            <li
              key={index}
              onClick={() => handleAddViewer(doc.email)}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <strong>{doc.name}</strong> <br />
              <small>{doc.email}</small>
            </li>
          ))}
        </ul>
      )}

      {statusMessage && (
        <p style={{ marginTop: "1rem", color: statusMessage.startsWith("✅") ? "green" : "red" }}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}
