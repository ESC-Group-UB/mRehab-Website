import React from "react";
import styles from "./FiltersBar.module.css";

type Props = {
  filterHand: string;
  filterExercise: string;
  filterStartDate: string;
  filterEndDate: string;
  dataKey: string;
  setFilterHand: (val: string) => void;
  setFilterExercise: (val: string) => void;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  setDataKey: (val: string) => void; 
};

export default function FiltersBar({
  filterHand,
  filterExercise,
  filterStartDate,
  filterEndDate,
  dataKey,
  setFilterHand,
  setFilterExercise,
  setStartDate,
  setEndDate,
  setDataKey
}: Props) {
  return (
    <div className={styles.wrap}>
      <select
        aria-label="Filter by hand"
        value={filterHand}
        onChange={(e) => setFilterHand(e.target.value)}
        className={`${styles.field} ${styles.select}`}
      >
        <option value="">All Hands</option>
        <option value="Left">Left</option>
        <option value="Right">Right</option>
      </select>

      <select
        aria-label="Filter by Metric"
        value={dataKey}
        onChange={(e) => setDataKey(e.target.value)}
        className={`${styles.field} ${styles.select}`}
      >
        <option value="Accuracy">Accuracy</option>
        <option value="Reps">Reps</option>
        <option value="Duration">Duration</option>
      </select>

      <select
        aria-label="Filter by exercise"
        value={filterExercise}
        onChange={(e) => setFilterExercise(e.target.value)}
        className={`${styles.field} ${styles.select}`}
      >
        <option value="">All Exercises</option>
        <option value="Vertical Bowl">Vertical Bowl</option>
        <option value="Horizontal Bowl">Horizontal Bowl</option>
        <option value="Horizontal Mug">Horizontal Mug</option>
        <option value="Vertical Mug">Vertical Mug</option>
        <option value="Sip from Mug">Sip from Mug</option>
        <option value="Quick Test Mug">Quick Test Mug</option>
        <option value="Slow Pour Mug">Slow Pour Mug</option>
        <option value="Phone Number">Phone Number</option>
        <option value="Quick Tap">Quick Tap</option>
      </select>

      <input
        aria-label="Start date"
        type="date"
        value={filterStartDate}
        onChange={(e) => setStartDate(e.target.value)}
        className={`${styles.field} ${styles.date}`}
      />

      <input
        aria-label="End date"
        type="date"
        value={filterEndDate}
        onChange={(e) => setEndDate(e.target.value)}
        className={`${styles.field} ${styles.date}`}
      />

      
    </div>
  );
}
