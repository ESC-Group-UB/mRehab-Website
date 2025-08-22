import React from "react";
import "./ImpactSection.css";

const stats = [
  { value: "30%+", label: "Gain in hand and arm control after 6 weeks" },
  { value: "10x", label: "Cheaper than traditional clinic-based rehab" },
  { value: "98%", label: "Users say daily reminders keep them motivated" },
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
