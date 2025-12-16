import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { Navbar } from "../../components/Navbar";
import { jwtDecode } from "jwt-decode";

export default function Login() {

  const baseURL = process.env.REACT_APP_BACKEND_API_URL; 
  if (!baseURL) {
    throw new Error("❌ Missing REACT_APP_BACKEND_API_URL — did you set it in Coolify?");
  }
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle; // Reset on unmount
    };
  }, []);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log(`Logging ${baseURL}`); 
    try {
      const res = await fetch(`${baseURL}api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      console.log("Login response:", data);
      if (data.error) {
        if (data.error === "User is not confirmed.") {
          console.log("User is not confirmed, Redirecting to confirm page");
          navigate("/confirm");
        }
        console.log("Login error:", data.error);
        return;
      }

      // Redirect to propper dashboard based on role
      const decoded: any = jwtDecode(data.IdToken);
      console.log("Decoded token:", decoded);
      const groups = decoded["cognito:groups"] || [];

      // set the id token to the local storage
      localStorage.setItem("idToken", data.IdToken);
      localStorage.setItem("accessToken", data.AccessToken);
      localStorage.setItem("tokenExpiry", data.ExpiresIn);

      if (groups.includes("Provider") || groups.includes("provider")) {
        navigate("/dashboard");
      } else if (groups.includes("Patient") || groups.includes("patient")) {
        navigate("/patient-dashboard");
      }
      } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      <Navbar />
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Welcome Back</h2>
        <p className={styles.subtitle}>Log in to continue using mRehab</p>

        <form onSubmit={handleLogin} className={styles.form}>
          {error && <p className={styles.error}>{error}</p>}

          <label>Email</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <label>Password</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

          <button type="submit" className={styles.loginButton}>Log In</button>
        </form>

        <div className={styles.links}>
          <p>
            Don’t have an account?{" "}
            <span onClick={() => navigate("/signup")}>Sign Up</span>
          </p>
          <p>
            <span onClick={() => navigate("/forgot-password")}>Forgot Password?</span>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
