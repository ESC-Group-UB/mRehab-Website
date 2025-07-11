import React from "react";
import "./Features.css";

export function Features() {
  return (
    <section className="features-section">
      <div className="features-header">
        <h2 className="features-title">Everything You Need for a Smarter Recovery</h2>
        <p className="features-subtitle">
          Recover faster and easier with AI-powered routines, easy-to-use tools, and real-time progress tracking.
        </p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <img src="/icons/AI.png" alt="AI Icon" className="feature-icon-image" />
          </div>
            <h3 className="feature-heading">
              AI-Guided Recovery
            </h3>
            <p className="feature-description">
              Your personal recovery coach real-time feedback and smart adjustments that keep you on track.
            </p>
            <a href="/how-it-works" className="feature-link">
              <span className="arrow">→</span>
            </a>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <img src="/icons/3dprint.png" alt="AI Icon" className="feature-icon-image" />
          </div>
            <h3 className="feature-heading">
              3D printed Tools
            </h3>
            <p className="feature-description">
              Custom tools built just for your rehab designed to fit your needs and improve results.
            </p>
            <a href="/how-it-works" className="feature-link">
              <span className="arrow">→</span>
            </a>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <img src="/icons/cloud.png" alt="AI Icon" className="feature-icon-image" />
          </div>
            <h3 className="feature-heading">
              Track your progress
            </h3>
            <p className="feature-description">
              Stay motivated by seeing your progress in real time, anytime, from your phone.
            </p>
            <a href="/how-it-works" className="feature-link">
              <span className="arrow">→</span>
            </a>
        </div>
      </div>
    </section>
  );
}
