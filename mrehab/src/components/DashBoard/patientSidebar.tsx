import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Sidebar,
  Menu,
  MenuItem,
  SubMenu
} from 'react-pro-sidebar';
import styles from "./patientSidebar.module.css";

export function PatientSidebar({
  onSelectPatient,
  selectedPatient,
}: {
  onSelectPatient: (email: string) => void;
  selectedPatient: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [patients, setPatients] = useState<{ email: string; name?: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{ email: string; name?: string }[]>([]);
  const [patientsOpen, setPatientsOpen] = useState(false);


  const api = "api/authorizedUsers/getAllowedToViewUsers";
  const searchAPI = "api/authorizedUsers/search/auth";

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    const baseURL = process.env.REACT_APP_BACKEND_API_URL;
    if (!idToken || !baseURL) return;

    const decoded = JSON.parse(atob(idToken.split(".")[1]));
    const email = decoded.email;

    axios
      .get(`${baseURL}${api}`, { params: { username: email } })
      .then((res) => setPatients(res.data.map((email: string) => ({ email }))))
      .catch((err) => console.error("❌ Failed to fetch patients:", err));
  }, []);

  useEffect(() => {
    const baseURL = process.env.REACT_APP_BACKEND_API_URL;
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setPatientsOpen(true); // open submenu on valid search
    console.log("🔍 Searching for:", searchTerm);


    const idToken = localStorage.getItem("idToken");
    if (!idToken || !baseURL) return;
    const decoded = JSON.parse(atob(idToken.split(".")[1]));
    const email = decoded.email;

    const delayDebounce = setTimeout(() => {
      axios
        .get(`${baseURL}${searchAPI}`, { params: { query: searchTerm, email } })
        .then((res) => setSearchResults(res.data || []))
        .catch((err) => console.error("❌ Search failed:", err));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const displayedPatients = searchTerm.trim() ? searchResults : patients;

  const handleSignOut = () => {
    localStorage.removeItem("idToken");
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  return (
  <Sidebar
    collapsed={collapsed}
    width="260px"
    collapsedWidth="60px"
    backgroundColor="#f9f9f9"
    className={styles.sidebar}
  >
    {/* Sidebar header with logo */}
    <button
      type="button"
      onClick={() => setCollapsed(c => !c)}
      className={collapsed ? styles.brandSmall : styles.brand}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      <div className={styles.brandInner}>
        <img src="/mrehabIcon.png" alt="mRehab Logo" className={styles.brandImg} />
      </div>
    </button>

    <Menu>
      {collapsed ? (
        <MenuItem onClick={() => setCollapsed(false)}>🔍</MenuItem>
      ) : (
        <MenuItem>
          <input
            type="text"
            placeholder="Search patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </MenuItem>
      )}

      {collapsed ? (
        <MenuItem onClick={() => setCollapsed(false)}>👥</MenuItem>
      ) : (
        <SubMenu
          onClick={() => setPatientsOpen(!patientsOpen)}
          label={"Patients"}
          open={patientsOpen}
        >
          {displayedPatients.map((p, i) => (
            <MenuItem
              key={i}
              active={p.email === selectedPatient}
              onClick={() => onSelectPatient(p.email)}
            >
              {p.name || p.email}
            </MenuItem>
          ))}
        </SubMenu>
      )}

      {collapsed ? (
        <MenuItem onClick={() => setCollapsed(false)}>🚪</MenuItem>
      ) : (
        <MenuItem onClick={handleSignOut}>🚪 Sign Out</MenuItem>
      )}
    </Menu>
  </Sidebar>
);
}
