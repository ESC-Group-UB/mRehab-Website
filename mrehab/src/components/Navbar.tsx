import React from "react";
import "./Navbar.css";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">Logo</a>
      </div>
      <nav className="navbar-center">
        <a href="/start">Start Recovery</a>
        <a href="/how-it-works">How It Works</a>
        <a href="/user-stories">User Stories</a>
        <a href="providers">For Providers</a>
      </nav>
      <div className="navbar-right">
        <a href="/enroll">
          <button className="buy-button">Buy Now</button>
        </a>
      </div>
    </header>
  );
}
