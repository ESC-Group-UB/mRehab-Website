import React from "react";

export const HeroSection = ({ onCTA }: { onCTA: () => void }) => (
  <section className="hero">
    <h1>Revolutionize Your Rehab Practice</h1>
    <p>
      mRehab empowers you to remotely monitor, personalize, and optimize physical therapy using AI-driven insights.
    </p>
    <button onClick={onCTA}>Launch Dashboard</button>
  </section>
);

