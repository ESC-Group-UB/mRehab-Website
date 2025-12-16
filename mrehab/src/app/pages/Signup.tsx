// src/pages/Auth/Signup.tsx (adjust path as needed)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";
import { Navbar } from "../../components/Navbar";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;
const home = process.env.REACT_APP_API_URL;

const Signup: React.FC = () => {
  
  const navigate = useNavigate();



  const [formData, setFormData] = useState({
    email: "",
    password: "",
    givenName: "",
    familyName: "",
    gender: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    role: "",
    device: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"idle" | "signup">("idle");



  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("signup");
    try {
      await axios.post(`${baseURL}api/auth/signup`, {
        ...formData,
        address: `${formData.street} ${formData.city} ${formData.state} ${formData.zip}`.trim(),
      });

      // ✅ Navigate to confirm page, pass email via state
      navigate("/confirm", {
        state: { email: formData.email },
      });
    } catch (err: any) {
      console.error("❌ Signup failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading("idle");
    }
  };

  const disabledSignup =
    !formData.email ||
    !formData.password ||
    !formData.givenName ||
    !formData.familyName ||
    !formData.role ||
    !formData.street ||
    !formData.city ||
    !formData.state ||
    !formData.zip ||
    loading !== "idle";

  return (
    <>
      <Navbar />
      <div className={styles.pageWrapper}>
        <div className={styles.card}>
          {/* Stepper */}
          <ol className={styles.stepper} aria-label="Signup steps">
            <li className={`${styles.step} ${styles.active}`}>
              <span className={styles.stepDot} aria-hidden>
                1
              </span>
              <span className={styles.stepLabel}>Create account</span>
            </li>
            <li className={styles.step}>
              <span className={styles.stepDot} aria-hidden>
                2
              </span>
              <span className={styles.stepLabel}>Verify email</span>
            </li>
          </ol>

          <h2 className={styles.title}>Create Your Account</h2>
          <p className={styles.subtitle}>Sign up to get started with mRehab</p>

          <form onSubmit={handleSignup} className={styles.form} noValidate>
            {error && (
              <p className={styles.error} role="alert">
                {error}
              </p>
            )}

            {/* Email */}
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="you@example.com"
              />
            </div>

            {/* Password with toggle */}
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <div className={styles.passwordField}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className={styles.ghostBtn}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <p className={styles.helpText}>Use at least 8 characters.</p>
            </div>

            {/* Names */}
            <div className={`${styles.row} ${styles.row2}`}>
              <div className={styles.inputGroup}>
                <label htmlFor="givenName">First Name</label>
                <input
                  id="givenName"
                  name="givenName"
                  autoComplete="given-name"
                  value={formData.givenName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  placeholder="First name"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="familyName">Last Name</label>
                <input
                  id="familyName"
                  name="familyName"
                  autoComplete="family-name"
                  value={formData.familyName}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Role */}
            <fieldset className={styles.fieldset}>
              <legend className={styles.legend}>Role</legend>
              <div className={styles.radioRow}>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="role"
                    value="patient"
                    checked={formData.role === "patient"}
                    onChange={handleChange}
                  />
                  Patient
                </label>
                <label className={styles.radio}>
                  <input
                    type="radio"
                    name="role"
                    value="provider"
                    checked={formData.role === "provider"}
                    onChange={handleChange}
                  />
                  Health Care Provider
                </label>
              </div>
            </fieldset>

            {/* Gender */}
            <div className={styles.inputGroup}>
              <label htmlFor="gender">Gender (optional)</label>
              <input
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={styles.input}
                placeholder="e.g., Female / Male / Non-binary / Prefer not to say"
              />
            </div>


            {/* Address */}
            <div className={styles.inputGroup}>
              <label htmlFor="street">Street Address</label>
              <input
                id="street"
                name="street"
                autoComplete="address-line1"
                value={formData.street}
                onChange={handleChange}
                className={styles.input}
                required
                placeholder="123 Main St"
              />
            </div>

            <div className={`${styles.row} ${styles.row3}`}>
              <div className={styles.inputGroup}>
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  value={formData.city}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  autoComplete="address-level1"
                  value={formData.state}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  placeholder="NY"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="zip">Zip Code</label>
                <input
                  id="zip"
                  name="zip"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  pattern="\d*"
                  value={formData.zip}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  placeholder="10001"
                />
              </div>
            </div>

            <button
              type="submit"
              className={styles.signupButton}
              disabled={disabledSignup}
              aria-busy={loading === "signup"}
            >
              {loading === "signup" ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          <div className={styles.links}>
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className={styles.linkBtn}
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
