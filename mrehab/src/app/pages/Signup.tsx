import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";
import { Navbar } from "../../components/Navbar";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;
const home = process.env.REACT_APP_API_URL;

const Signup: React.FC = () => {
  const deviceOptions: Record<string, string[]> = {
    iPhone: [
      "iPhone 16 Pro Max",
      "iPhone 16 Pro",
      "iPhone 16 Plus",
      "iPhone 16",
      "iPhone 16e",
      "iPhone 15 Pro Max",
      "iPhone 15 Pro",
      "iPhone 15 Plus",
      "iPhone 15",
      "iPhone 14 Pro Max",
      "iPhone 14 Pro",
      "iPhone 14 Plus",
      "iPhone 14",
      "iPhone 13 Pro Max",
      "iPhone 13 Pro",
      "iPhone 13",
      "iPhone 13 mini",
      "iPhone 12 Pro Max",
      "iPhone 12 Pro",
      "iPhone 12",
      "iPhone 12 mini",
      "iPhone SE (3rd generation, 2022)",
    ],
    Samsung: [
      "Galaxy S25 Ultra",
      "Galaxy S25+",
      "Galaxy S25",
      "Galaxy S24 Ultra",
      "Galaxy S24+",
      "Galaxy S24",
      "Galaxy S24 FE",
      "Galaxy S23 Ultra",
      "Galaxy S23+",
      "Galaxy S23",
      "Galaxy S23 FE",
      "Galaxy S22 Ultra",
      "Galaxy S22+",
      "Galaxy S22",
      "Galaxy S21 Ultra",
      "Galaxy S21+",
      "Galaxy S21",
      "Galaxy S21 FE",
      "Galaxy Z Fold7",
      "Galaxy Z Flip7",
      "Galaxy Z Flip7 FE",
      "Galaxy Z Fold6",
      "Galaxy Z Flip6",
      "Galaxy Z Fold5",
      "Galaxy Z Flip5",
      "Galaxy Z Fold4",
      "Galaxy Z Flip4",
      "Galaxy Z Fold3",
      "Galaxy Z Flip3",
    ],
    Google: [
      "Pixel 10 Pro Fold",
      "Pixel 10 Pro XL",
      "Pixel 10 Pro",
      "Pixel 10",
      "Pixel 9 Pro Fold",
      "Pixel 9 Pro XL",
      "Pixel 9 Pro",
      "Pixel 9",
      "Pixel 9a",
      "Pixel 8a",
      "Pixel 8 Pro",
      "Pixel 8",
      "Pixel Fold",
      "Pixel 7a",
      "Pixel 7 Pro",
      "Pixel 7",
      "Pixel 6a",
      "Pixel 6 Pro",
      "Pixel 6",
      "Pixel 5a (5G)",
    ],
  };

  const navigate = useNavigate();
  const [step, setStep] = useState<"signup" | "verify">("signup");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

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
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"idle" | "signup" | "verify">("idle");

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value;
    setBrand(newBrand);
    setModel("");
    setFormData((prev) => ({ ...prev, device: "" }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setModel(newModel);
    setFormData((prev) => ({ ...prev, device: newModel }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading("verify");
    try {
      await axios.post(`${baseURL}api/auth/confirm`, {
        email: formData.email,
        code: verificationCode,
      });
      window.location.href = `${home}login`;
    } catch (err: any) {
      console.error("❌ Verify failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading("idle");
    }
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
      setStep("verify");
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
            <li className={`${styles.step} ${step === "signup" ? styles.active : styles.done}`}>
              <span className={styles.stepDot} aria-hidden>1</span>
              <span className={styles.stepLabel}>Create account</span>
            </li>
            <li className={`${styles.step} ${step === "verify" ? styles.active : ""}`}>
              <span className={styles.stepDot} aria-hidden>2</span>
              <span className={styles.stepLabel}>Verify email</span>
            </li>
          </ol>

          {step === "signup" ? (
            <>
              <h2 className={styles.title}>Create Your Account</h2>
              <p className={styles.subtitle}>Sign up to get started with mRehab</p>

              <form onSubmit={handleSignup} className={styles.form} noValidate>
                {error && <p className={styles.error} role="alert">{error}</p>}

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

                {/* Role (radio for faster mobile selection) */}
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

                {/* Gender (optional text keeps your schema unchanged) */}
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

                {/* Device */}
                <div className={styles.inputGroup}>
                  <label>What Device Will You Use mRehab With?</label>
                  <select
                    name="brand"
                    value={brand}
                    onChange={handleBrandChange}
                    className={styles.input}
                    aria-label="Select device brand"
                  >
                    <option value="" disabled>
                      Select brand
                    </option>
                    {Object.keys(deviceOptions).map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>

                  {brand && (
                    <select
                      name="device"
                      value={model}
                      onChange={handleModelChange}
                      className={styles.input}
                      aria-label="Select device model"
                    >
                      <option value="" disabled>
                        Select model
                      </option>
                      {deviceOptions[brand].map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  )}
                  <p className={styles.helpText}>
                    We use this to optimize sensor feedback for your phone.
                  </p>
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
            </>
          ) : (
            <div className={styles.verification}>
              <h2 className={styles.title}>Verify Your Email</h2>
              <p className={styles.subtitle}>
                Enter the 6-digit code sent to <strong>{formData.email}</strong>.
              </p>
              <form onSubmit={handleVerify} className={styles.form} noValidate>
                {error && <p className={styles.error} role="alert">{error}</p>}
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
                  disabled={!verificationCode || loading === "verify"}
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
                    onClick={() => setStep("signup")}
                  >
                    Go back
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Signup;
