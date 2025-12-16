import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import { Navbar } from "../../components/Navbar";

export default function ForgotPassword() {
  const baseURL = process.env.REACT_APP_BACKEND_API_URL;
  if (!baseURL) {
    throw new Error("❌ Missing REACT_APP_BACKEND_API_URL — did you set it in Coolify?");
  }

  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset code");
      }

      setSuccess(data.message || "Password reset code sent to your email");
      setStep("reset");
    } catch (err: any) {
      setError(err.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${baseURL}api/auth/confirm-forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          <h2 className={styles.title}>
            {step === "email" ? "Reset Your Password" : "Enter New Password"}
          </h2>
          <p className={styles.subtitle}>
            {step === "email"
              ? "Enter your email address and we'll send you a code to reset your password"
              : `Enter the code sent to ${email} and your new password`}
          </p>

          {step === "email" ? (
            <form onSubmit={handleSendCode} className={styles.form}>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}

              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                disabled={loading}
              />

              <button
                type="submit"
                className={styles.button}
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "Send Reset Code"}
              </button>

              <div className={styles.links}>
                <p>
                  Remember your password?{" "}
                  <span onClick={() => navigate("/login")}>Log In</span>
                </p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className={styles.form}>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}

              <label htmlFor="code">Verification Code</label>
              <input
                id="code"
                type="text"
                required
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className={styles.input}
                disabled={loading}
                maxLength={6}
                inputMode="numeric"
              />

              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.input}
                disabled={loading}
                minLength={8}
              />

              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                disabled={loading}
                minLength={8}
              />

              <button
                type="submit"
                className={styles.button}
                disabled={loading || !code || !newPassword || !confirmPassword}
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>

              <div className={styles.links}>
                <p>
                  Didn't receive the code?{" "}
                  <span
                    onClick={() => {
                      setStep("email");
                      setCode("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setError("");
                    }}
                  >
                    Resend
                  </span>
                </p>
                <p>
                  Remember your password?{" "}
                  <span onClick={() => navigate("/login")}>Log In</span>
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

