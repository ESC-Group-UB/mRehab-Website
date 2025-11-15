import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./sidebar.module.css";

type Patient = { email: string; name?: string };

export function Sidebar({
  selectedPatient,
  onSelectPatient,
}: {
  selectedPatient: string;
  onSelectPatient: (email: string) => void;
}) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isPatientsOpen, setIsPatientsOpen] = useState(true);

  const baseURL = process.env.REACT_APP_BACKEND_API_URL;
  const listAPI = "api/authorizedUsers/getAllowedToViewUsers";
  const searchAPI = "api/authorizedUsers/search";

  // Fetch allowed patients once
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    if (!token || !baseURL) return;
    const { email } = JSON.parse(atob(token.split(".")[1]));

    axios
      .get(`${baseURL}${listAPI}`, { params: { username: email } })
      .then((res) =>
        setPatients(res.data.map((e: string) => ({ email: e })))
      )
      .catch(console.error);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const handle = setTimeout(() => {
      axios
        .get(`${baseURL}${searchAPI}`, { params: { query: searchTerm } })
        .then((res) => setSearchResults(res.data.map((e: string) => ({ email: e }))))
        .catch(console.error);
    }, 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const list = searchTerm.trim() ? searchResults : patients;

  return (
    <aside
      className={`${styles.sidebar} ${
        isExpanded ? styles.expanded : styles.collapsed
      }`}
    >
      <button
        className={styles.toggle}
        onClick={() => setIsExpanded((v) => !v)}
        aria-label="Toggle sidebar"
      >
        {isExpanded ? "«" : "»"}
      </button>

      {isExpanded && (
        <>
          <div className={styles.searchContainer}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="🔍 Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.section}>
            <button
              className={styles.sectionHeader}
              onClick={() => setIsPatientsOpen((v) => !v)}
            >
              <span>Patients</span>
              <span
                className={`${styles.chevron} ${
                  isPatientsOpen ? styles.open : ""
                }`}
              >
                ▼
              </span>
            </button>

            <ul
              className={`${styles.list} ${
                isPatientsOpen ? styles.open : ""
              }`}
            >
              {list.map((p, i) => (
                <li
                  key={i}
                  className={`${styles.item} ${
                    selectedPatient === p.email ? styles.active : ""
                  }`}
                  onClick={() => onSelectPatient(p.email)}
                >
                  {p.name || p.email}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.footer}>
            <button className={styles.footerItem}>Profile Settings</button>
            <button className={styles.footerItem}>Billing</button>
            <button className={styles.footerItem}>Sign Out</button>
          </div>
        </>
      )}
    </aside>
  );
}
