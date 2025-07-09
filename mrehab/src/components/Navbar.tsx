import React from "react";
import "./Navbar.css";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="#" className="logo">Logo</a>
      </div>
      <nav className="navbar-center">
        <a href="#">Start Recovery</a>
        <a href="#">How It Works</a>
        <a href="#">User Stories</a>
        <a href="#">For Providers</a>
      </nav>
      <div className="navbar-right">
        <a href="/enroll">
          <button className="buy-button">Buy Now</button>
        </a>
      </div>
    </header>
  );
}
