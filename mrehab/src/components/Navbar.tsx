import React, { use } from "react";
import "./Navbar.css";
import { useEffect, useState } from "react";

export function Navbar() {

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">mRehab</a>
      </div>

      <nav className="navbar-center">
        <a href="/how-it-works">How It Works</a>
        <a href="/user-stories">User Stories</a>
        <a href="/for-providers">For Providers</a>
        <a href="/buy-now">Buy Now</a>
      </nav>

      <div className="navbar-right">
        {loggedIn ? (
          <a href="/dashboard" className="login-button">Dashboard</a>
        ) : (
          <a href="/login" className="login-button">Login</a>
        )}
      </div>
    </header>
  );
}
