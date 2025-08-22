// components/ActivitiesSelector.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ActivitiesSelector.module.css";

type ActivitiesMap = Record<string, boolean>;

type Props = {
  patientEmail: string;                // whose activities we’re editing
  initialActivities?: ActivitiesMap;   // optional server-provided seed
  categories?: Record<string, string[]>; // optional grouping: { "Mug": ["Vertical Mug", ...] }
};

const baseURL = process.env.REACT_APP_BACKEND_API_URL;

export default function ActivitiesSelector({
  patientEmail,
  initialActivities,
  categories,
}: Props) {
  const [activities, setActivities] = useState<ActivitiesMap>(initialActivities || {});
  const [loading, setLoading] = useState(!initialActivities);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [saveState, setSaveState] =
    useState<"idle" | "saving" | "saved" | "error">("idle");
  const lastSentRef = useRef<ActivitiesMap | null>(null);
  const debounceRef = useRef<number | null>(null);

  // NEW: track collapsed state by group name
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleCollapse = (groupName: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  // Fetch current settings if not provided
  useEffect(() => {
    if (initialActivities) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const idToken = localStorage.getItem("idToken");
        const res = await fetch(
          `${baseURL}api/aws/user-settings?email=${encodeURIComponent(patientEmail)}`,
          { headers: { Authorization: `Bearer ${idToken || ""}` } }
        );
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setActivities(data?.Activities ?? {});
          setLoading(false);
        }
      } catch (e: any) {
        if (!cancelled) {
          setError("Could not load activities.");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [patientEmail, initialActivities]);

  // Debounced autosave whenever activities change
  useEffect(() => {
    if (loading) return;
    if (!activities || Object.keys(activities).length === 0) return;

    const changed =
      !lastSentRef.current ||
      JSON.stringify(lastSentRef.current) !== JSON.stringify(activities);

    if (!changed) return;

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    setSaveState("saving");

    debounceRef.current = window.setTimeout(async () => {
      try {
        const idToken = localStorage.getItem("idToken");
        const res = await fetch(`${baseURL}api/aws/updateActivities`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken || ""}`,
          },
          body: JSON.stringify({
            email: patientEmail,
            activities, // full replacement map
          }),
        });
        if (!res.ok) throw new Error(`Save failed: ${res.status}`);
        lastSentRef.current = activities;
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1200);
      } catch {
        setSaveState("error");
      }
    }, 700);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities, loading, patientEmail]);

  const allKeys = useMemo(() => Object.keys(activities), [activities]);

  const filteredKeys = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return allKeys;
    return allKeys.filter((k) => k.toLowerCase().includes(q));
  }, [allKeys, filter]);

  const grouped = useMemo(() => {
    if (!categories) return { All: filteredKeys };
    const r: Record<string, string[]> = {};
    for (const [cat, keys] of Object.entries(categories)) {
      r[cat] = keys.filter((k) => filteredKeys.includes(k));
    }
    // Optional: ungrouped leftovers under "Other"
    const inAny = new Set(Object.values(categories).flat());
    const leftovers = filteredKeys.filter((k) => !inAny.has(k));
    if (leftovers.length) r["Other"] = leftovers;
    return r;
  }, [categories, filteredKeys]);

  const toggleOne = (key: string) => {
    setActivities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setMany = (keys: string[], value: boolean) => {
    setActivities((prev) => {
      const next = { ...prev };
      keys.forEach((k) => {
        next[k] = value;
      });
      return next;
    });
  };

  const enableAll = () => setMany(filteredKeys, true);
  const disableAll = () => setMany(filteredKeys, false);

  // Group header helpers
  const groupState = (keys: string[]) => {
    const enabled = keys.filter((k) => activities[k]);
    if (enabled.length === 0) return "none";
    if (enabled.length === keys.length) return "all";
    return "some"; // indeterminate
  };

  const toggleGroup = (keys: string[]) => {
    const state = groupState(keys);
    const target = state === "all" ? false : true;
    setMany(keys, target);
  };

  if (loading) return <div className={styles.activities__loading}>Loading activities…</div>;
  if (error) return <div className={styles.activities__error}>{error}</div>;

  return (
    <div className={styles.activities}>
        <h2>Patient Activities</h2>
      <div className={styles.activities__toolbar}>
        <input
          className={styles.activities__search}
          placeholder="Search activities…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Search activities"
        />
        <div className={styles.activities__bulk}>
          <button className={styles.btn} onClick={enableAll}>
            Enable all (filtered)
          </button>
          <button
            className={`${styles.btn} ${styles["btn--secondary"]}`}
            onClick={disableAll}
          >
            Disable all (filtered)
          </button>
        </div>
      </div>

      <div className={styles.activities__groups}>
        {Object.entries(grouped).map(([cat, keys]) => {
          if (keys.length === 0) return null;
          const state = groupState(keys);
          const isCollapsed = !!collapsedGroups[cat];

          return (
            <section key={cat} className={styles.activities__group}>
              {/* Header row: arrow toggle + master checkbox */}
              <div
                className={styles.activities__groupHeader}
                onClick={() => toggleCollapse(cat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleCollapse(cat);
                  }
                }}
                aria-expanded={!isCollapsed}
                aria-controls={`group-panel-${cat}`}
              >
                <span className={styles.activities__collapseIcon}>
                  {isCollapsed ? "▶" : "▼"}
                </span>

                {/* Stop propagation so clicking the checkbox won't toggle collapse */}
                <input
                  type="checkbox"
                  aria-checked={state === "some" ? "mixed" : state === "all"}
                  ref={(el) => {
                    if (el) el.indeterminate = state === "some";
                  }}
                  checked={state === "all"}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleGroup(keys);
                  }}
                  id={`group-${cat}`}
                />
                <label
                  htmlFor={`group-${cat}`}
                  className={styles.activities__groupTitle}
                  onClick={(e) => e.stopPropagation()}
                >
                  {cat}
                </label>
              </div>

              {/* Collapsible panel */}
              {!isCollapsed && (
                <ul
                  id={`group-panel-${cat}`}
                  className={styles.activities__list}
                >
                  {keys.map((k) => (
                    <li key={k} className={styles.activities__item}>
                      <label className={styles.activities__label}>
                        <input
                          type="checkbox"
                          checked={!!activities[k]}
                          onChange={() => toggleOne(k)}
                          aria-label={k}
                          // prevent collapsing if user clicks the item row
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className={styles.activities__name}>{k}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        <div
          className={`${styles.activities__savestate} ${styles[`activities__savestate--${saveState}`]}`}
        >
          {saveState === "saving" && "Saving…"}
          {saveState === "saved" && "Saved"}
          {saveState === "error" && "Save failed. Retrying on next change."}
        </div>
      </div>
    </div>
  );
}
