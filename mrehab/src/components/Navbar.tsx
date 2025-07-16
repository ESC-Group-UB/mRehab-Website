import React from "react";
import "./Navbar.css";

export function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">mRehab</a>
      </div>
      <nav className="navbar-center">
        <a href="/start">Start Recovery</a>
        <a href="/how-it-works">How It Works</a>
        <a href="/user-stories">User Stories</a>
        <a href="/for-providers">For Providers</a>
      </nav>
      <div className="navbar-right">
        <a href="/buy-now">
          <button className="buy-button">Buy Now</button>
        </a>
        <a
          href="/login"
        >
          <button className="buy-button">Login with Cognito</button>
        </a>
      </div>
    </header>
  );
}
