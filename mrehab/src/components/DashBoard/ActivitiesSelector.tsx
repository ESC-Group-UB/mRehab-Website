import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ActivitiesSelector.module.css";

interface ActivityConfig {
  enabled: boolean;
  SuggestedReps?: number;
}

interface ActivitiesMap {
  [activityName: string]: ActivityConfig;
}

type Props = {
  patientEmail: string;
  initialActivities?: ActivitiesMap;
  categories?: Record<string, string[]>;
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
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const lastSentRef = useRef<ActivitiesMap | null>(null);
  const debounceRef = useRef<number | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleCollapse = (groupName: string) =>
    setCollapsedGroups((prev) => ({ ...prev, [groupName]: !prev[groupName] }));

  // Fetch user settings if not provided
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
      } catch {
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

  // Debounced autosave
  useEffect(() => {
    if (loading || Object.keys(activities).length === 0) return;
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
            activities, // send the full object
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
  }, [activities, loading, patientEmail]);

  const allKeys = useMemo(() => Object.keys(activities), [activities]);
  const filteredKeys = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return q ? allKeys.filter((k) => k.toLowerCase().includes(q)) : allKeys;
  }, [allKeys, filter]);

  const grouped = useMemo(() => {
    if (!categories) return { All: filteredKeys };
    const r: Record<string, string[]> = {};
    for (const [cat, keys] of Object.entries(categories)) {
      r[cat] = keys.filter((k) => filteredKeys.includes(k));
    }
    const inAny = new Set(Object.values(categories).flat());
    const leftovers = filteredKeys.filter((k) => !inAny.has(k));
    if (leftovers.length) r["Other"] = leftovers;
    return r;
  }, [categories, filteredKeys]);

  const toggleOne = (key: string) => {
    setActivities((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key]?.enabled,
        SuggestedReps: prev[key]?.SuggestedReps ?? 10,
      },
    }));
  };

  const updateReps = (key: string, reps: number) => {
    setActivities((prev) => ({
      ...prev,
      [key]: { ...prev[key], SuggestedReps: reps },
    }));
  };

  const setMany = (keys: string[], value: boolean) => {
    setActivities((prev) => {
      const next = { ...prev };
      keys.forEach((k) => {
        next[k] = {
          enabled: value,
          SuggestedReps: prev[k]?.SuggestedReps ?? 10,
        };
      });
      return next;
    });
  };

  const enableAll = () => setMany(filteredKeys, true);
  const disableAll = () => setMany(filteredKeys, false);

  if (loading) return <div className={styles.activities__loading}>Loading activities…</div>;
  if (error) return <div className={styles.activities__error}>{error}</div>;

  return (
    <div className={styles.activities}>
      <h2>Patient Activities</h2>

      {/* Toolbar */}
      <div className={styles.activities__toolbar}>
        <input
          className={styles.activities__search}
          placeholder="Search activities…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className={styles.activities__bulk}>
          <button className={styles.btn} onClick={enableAll}>
            Enable all
          </button>
          <button className={`${styles.btn} ${styles["btn--secondary"]}`} onClick={disableAll}>
            Disable all
          </button>
        </div>
      </div>

      {/* Activity Groups */}
      <div className={styles.activities__groups}>
        {Object.entries(grouped).map(([cat, keys]) => {
          if (keys.length === 0) return null;
          const isCollapsed = !!collapsedGroups[cat];
          return (
            <section key={cat} className={styles.activities__group}>
              <div
                className={styles.activities__groupHeader}
                onClick={() => toggleCollapse(cat)}
                role="button"
                aria-expanded={!isCollapsed}
              >
                <span className={styles.activities__collapseIcon}>
                  {isCollapsed ? "▶" : "▼"}
                </span>
                <strong>{cat}</strong>
              </div>

              {!isCollapsed && (
                <ul className={styles.activities__list}>
                  {keys.map((k) => {
                    const cfg = activities[k] || { enabled: false, SuggestedReps: 10 };
                    return (
                      <li key={k} className={styles.activities__item}>
                        <label className={styles.activities__label}>
                          <input
                            type="checkbox"
                            checked={cfg.enabled}
                            onChange={() => toggleOne(k)}
                          />
                          <span className={styles.activities__name}>{k}</span>
                        </label>

                        <div className={styles.activities__repsWrapper}>
                          <input
                            type="number"
                            min={0}
                            value={cfg.SuggestedReps ?? 0}
                            onChange={(e) => updateReps(k, Number(e.target.value))}
                            className={styles.activities__reps}
                          />
                          <span className={styles.activities__repsLabel}>reps</span>
                        </div>
                      </li>
                    );
                  })}
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
