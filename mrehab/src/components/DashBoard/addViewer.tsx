import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import styles from "./addViewer.module.css";

type Doctor = {
  name: string;
  email: string;
};

/** Safe base64url JWT payload decode (no new libs) */
function decodeJwtPayload(idToken: string): any | null {
  try {
    const payload = idToken.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4 === 0 ? "" : "=".repeat(4 - (base64.length % 4));
    return JSON.parse(atob(base64 + pad));
  } catch {
    return null;
  }
}

export default function AddViewer() {
  const addAPI = "api/authorizedUsers/addAuthorizedUser";
  const searchAPI = "api/authorizedUsers/search";

  // Ensure trailing slash if provided
  const apiBase = useMemo(() => {
    const raw = process.env.REACT_APP_BACKEND_API_URL || "";
    return raw ? (raw.endsWith("/") ? raw : `${raw}/`) : "";
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  // Keyboard/UX state
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    let cancelToken = axios.CancelToken.source();

    if (!searchTerm.trim()) {
      setSearchResults([]);
      setOpen(false);
      setSearchError(null);
      setSearchLoading(false);
      setActiveIndex(-1);
      return;
    }

    setSearchLoading(true);
    setSearchError(null);

    const t = setTimeout(async () => {
      try {
        const res = await axios.get(`${apiBase}${searchAPI}`, {
          params: { query: searchTerm.trim() },
          cancelToken: cancelToken.token,
        });
        setSearchResults(res.data || []);
        setOpen(true);
        setActiveIndex((prev) => (res.data && res.data.length ? Math.min(prev, res.data.length - 1) : -1));
      } catch (err: any) {
        if (!axios.isCancel(err)) {
          console.error("❌ Search failed:", err);
          setSearchError("Search failed. Try again.");
          setSearchResults([]);
          setOpen(true);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(t);
      cancelToken.cancel();
    };
  }, [apiBase, searchTerm, searchAPI]);

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const handleAddViewer = async (email: string) => {
    setStatusMessage("");
    setStatusType("");

    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      setStatusMessage("Please log in to add an authorized viewer.");
      setStatusType("error");
      return;
    }

    const decoded = decodeJwtPayload(idToken);
    const currentUserEmail = decoded?.email;
    if (!currentUserEmail) {
      setStatusMessage("Could not read your account email. Please re-login.");
      setStatusType("error");
      return;
    }

    try {
      await axios.post(`${apiBase}${addAPI}`, {
        username: currentUserEmail,
        authorizedUser: email,
      });
      setStatusMessage(`✅ Added ${email}`);
      setStatusType("success");
      setSearchTerm("");
      setSearchResults([]);
      setOpen(false);
      setActiveIndex(-1);
      // keep focus in input for quick subsequent adds
      inputRef.current?.focus();
    } catch (err: any) {
      console.error("❌ Failed to add viewer:", err);
      setStatusMessage(`❌ Could not add ${email}`);
      setStatusType("error");
    }
  };

  // Keyboard navigation: ↑/↓ to move; Enter to add; Escape to close
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => {
        const next = Math.min(i + 1, searchResults.length - 1);
        return next < 0 ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < searchResults.length) {
        e.preventDefault();
        handleAddViewer(searchResults[activeIndex].email);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <h2 className={styles.title}>Add Your Doctor As An Authorized User</h2>

      <div
        ref={wrapRef}
        className={styles.inputWrap}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-owns="doctor-results"
      >
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setOpen(true);
          }}
          onFocus={() => searchResults.length && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search doctors by name or email"
          className={styles.input}
          aria-autocomplete="list"
          aria-controls="doctor-results"
          aria-activedescendant={
            activeIndex >= 0 && searchResults[activeIndex]
              ? `option-${activeIndex}`
              : undefined
          }
        />

        {/* Helper hint */}

        {/* Results popover */}
        {open && (
          <div className={styles.results}>
            <ul id="doctor-results" className={styles.resultsList} role="listbox">
              {searchLoading && (
                <li className={styles.stateRow} role="status">Searching…</li>
              )}

              {!searchLoading && searchError && (
                <li className={styles.stateRow} role="status">{searchError}</li>
              )}

              {!searchLoading && !searchError && searchResults.length === 0 && searchTerm.trim() && (
                <li className={styles.stateRow} role="status">No matches</li>
              )}

              {!searchLoading && !searchError && searchResults.map((doc, i) => (
                <li
                  id={`option-${i}`}
                  key={`${doc.email}-${i}`}
                  role="option"
                  aria-selected={activeIndex === i}
                  className={`${styles.item} ${activeIndex === i ? "active" : ""}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()} /* keep focus on input */
                  onClick={() => handleAddViewer(doc.email)}
                >
                  <span className={styles.name}>{doc.name}</span>
                  <span className={styles.email}>{doc.email}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {statusMessage && (
        <p className={`${styles.status} ${statusType === "success" ? styles.success : styles.error}`}>
          {statusMessage}
        </p>
      )}
    </div>
  );
}
