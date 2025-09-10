import React from "react";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export function Navbar() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [providerDashboard, setProviderDashboard] = useState(false);

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      const decoded: any = jwtDecode(idToken);
      const groups = decoded["cognito:groups"] || [];
      if (groups.includes("provider") || groups.includes("Provider")) {
        setProviderDashboard(true);
      }
      setLoggedIn(true);
    }
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <a href="/" className="logo">
          <img src="/mrehabIcon.png" alt="mRehab Logo" height="35" />
        </a>
      </div>

      <nav className="navbar-center">
        <a href="/how-it-works">How It Works</a>
        {/* removed for demo accuracy
        <a href="/user-stories">User Stories</a> */}
        <a href="/for-providers">For Providers</a>
        <a href="/buy-now">Buy Now</a>
      </nav>

      <div className="navbar-right">
        {loggedIn ? (
          providerDashboard ? (
            <a href="/dashboard" className="login-button">Dashboard</a>
          ) : (
            <a href="/patient-dashboard" className="login-button">Dashboard</a>
          )
        ) : (
          <a href="/login" className="login-button">Login</a>
        )}
      </div>
    </header>
  );
}
