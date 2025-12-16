import React from "react";
import "./Hero1.css";
import { Link } from "react-router-dom";

export function Hero1() {
  return (
    <section className="hero-section fullscreen-hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Empower Your Recovery with mRehab Today</h1>
        <p>
          Reclaim your mobility with our innovative AI-powered app and
          affordable 3D-printed therapy tools. Start your journey to recovery
          from the comfort of your home.
        </p>
        <div className="hero-buttons">
          <Link to="/shopping" className="btn primary">
            Get the mRehab Starter Kit
          </Link>
          <Link to="/how-it-works" className="btn secondary">
            Learn More
          </Link>
        </div>
      </div>
    </section>
  );
}
