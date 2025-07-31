import React from "react";

type Props = {
  filterHand: string;
  filterExercise: string;
  filterStartDate: string;
  filterEndDate: string;
  setFilterHand: (val: string) => void;
  setFilterExercise: (val: string) => void;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
};

export default function FiltersBar({
  filterHand,
  filterExercise,
  filterStartDate,
  filterEndDate,
  setFilterHand,
  setFilterExercise,
  setStartDate,
  setEndDate,
}: Props) {
  return (
    <div style={{ margin: "20px 0", display: "flex", flexWrap: "wrap", gap: "10px" }}>
      <select value={filterHand} onChange={(e) => setFilterHand(e.target.value)} style={{ padding: "8px", flex: "1 1 120px" }}>
        <option value="">All Hands</option>
        <option value="Left">Left</option>
        <option value="Right">Right</option>
      </select>

      <select value={filterExercise} onChange={(e) => setFilterExercise(e.target.value)} style={{ padding: "8px", flex: "1 1 180px" }}>
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

      <input type="date" value={filterStartDate} onChange={(e) => setStartDate(e.target.value)} style={{ padding: "8px", flex: "1 1 150px" }} />
      <input type="date" value={filterEndDate} onChange={(e) => setEndDate(e.target.value)} style={{ padding: "8px", flex: "1 1 150px" }} />
    </div>
  );
}
