// src/pages/Auth/ConfirmSignup.tsx (adjust path as needed)
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";
import { Navbar } from "../../components/Navbar";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;
const home = process.env.REACT_APP_API_URL;

interface LocationState {
  email?: string;
}

const ConfirmSignup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // Prefer email from navigation state; allow manual input if missing
  const [email, setEmail] = useState(state?.email ?? "");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"idle" | "verify">("idle");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("verify");
    try {
      await axios.post(`${baseURL}api/auth/confirm`, {
        email,
        code: verificationCode,
      });

      // You were using home + login previously; keep that behavior
      window.location.href = `${home}/login`;
      // or: navigate("/login");
    } catch (err: any) {
      console.error("❌ Verify failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading("idle");
    }
  };

  const disableVerify =
    !verificationCode || !email || loading === "verify";

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          {/* Stepper */}
          <ol className={styles.stepper} aria-label="Signup steps">
            <li className={`${styles.step} ${styles.done}`}>
              <span className={styles.stepDot} aria-hidden>
                1
              </span>
              <span className={styles.stepLabel}>Create account</span>
            </li>
            <li className={`${styles.step} ${styles.active}`}>
              <span className={styles.stepDot} aria-hidden>
                2
              </span>
              <span className={styles.stepLabel}>Verify email</span>
            </li>
          </ol>

          <div className={styles.verification}>
            <h2 className={styles.title}>Verify Your Email</h2>
            <p className={styles.subtitle}>
              Enter the 6-digit code sent to{" "}
              <strong>{email || "your email"}</strong>.
            </p>

            <form onSubmit={handleVerify} className={styles.form} noValidate>
              {error && (
                <p className={styles.error} role="alert">
                  {error}
                </p>
              )}

              {/* If email is missing from state, allow editing */}
              {!state?.email && (
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                    placeholder="you@example.com"
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="code">Verification Code</label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  pattern="\d*"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={styles.input}
                  required
                  placeholder="••••••"
                />
              </div>

              <button
                type="submit"
                className={styles.signupButton}
                disabled={disableVerify}
                aria-busy={loading === "verify"}
              >
                {loading === "verify" ? "Verifying…" : "Confirm"}
              </button>
            </form>

            <div className={styles.links}>
              <p>
                Wrong email?{" "}
                <button
                  type="button"
                  className={styles.linkBtn}
                  onClick={() => navigate("/signup")}
                >
                  Go back
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmSignup;
