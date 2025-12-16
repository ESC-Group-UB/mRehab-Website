import React from "react";
import "./ImpactSection.css";
// 1. Keep IconType for the interface
import { IconType } from "react-icons";
import { FiActivity, FiZap, FiSmartphone } from "react-icons/fi";

interface ImpactItem {
  icon: IconType; // This allows the array assignments below to work
  title: string;
  description: string;
};

const stats: ImpactItem[] = [
  {
    icon: FiActivity,
    title: "Daily-life Exercises",
    description:
      "Practice movements that map to real routines like reaching, lifting, and stabilizing.",
  },
  {
    icon: FiSmartphone,
    title: "Low-cost & Personalized",
    description:
      "A simple, accessible device + app that adapts to your rehab needs over time.",
  },
  {
    icon: FiZap,
    title: "Real-time Feedback",
    description:
      "Instant guidance so you know you’re doing the motion correctly and consistently.",
  },
];

export default function ImpactSection() {
  return (
    <section className="impact-section">
      <div className="impact-heading">
        <h2>Why People Love mRehab</h2>
        <p>
          Rehab is hard — mRehab makes it simpler, more motivating, and easier to
          fit into everyday life.
        </p>
      </div>

      <div className="impact-grid">
        {stats.map((item, index) => {
          // 2. THE FIX: Create a temporary variable cast as ElementType.
          // This tells TypeScript: "Trust me, this is a valid component."
          const Icon = item.icon as React.ElementType;

          return (
            <div className="impact-card" key={index}>
              <div className="impact-icon">
                {/* 3. Render the cast variable */}
                <Icon aria-hidden="true" />
              </div>

              <h3 className="impact-title">{item.title}</h3>
              <p className="impact-desc">{item.description}</p>
            </div>
          );
        })}
      </div>  
    </section>
  );
}