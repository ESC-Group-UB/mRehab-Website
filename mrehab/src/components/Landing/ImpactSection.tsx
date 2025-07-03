import React from "react";
import "./ImpactSection.css";

const stats = [
  { value: "+30%", label: "Improvement in motor control" },
  { value: "10x", label: "More affordable than clinic-based rehab" },
  { value: "98%", label: "Say mRehab keeps them motivated and on track" },
];

export default function ImpactSection() {
  return (
    <section className="impact-section">
      <div className="impact-heading">
        <h2>Why People Love mRehab</h2>
        <p>
          Recovering from a stroke or injury is hard — but it doesn’t have to be confusing or overwhelming. With mRehab, you get tools that are easy to use, motivating, and designed to fit into your everyday life.
        </p>
      </div>
      <div className="impact-stats">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
