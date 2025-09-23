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
    // 2024–2025
    "iPhone 16 Pro Max",
    "iPhone 16 Pro",
    "iPhone 16 Plus",
    "iPhone 16",
    "iPhone 16e",               // 2025
    // 2023
    "iPhone 15 Pro Max",
    "iPhone 15 Pro",
    "iPhone 15 Plus",
    "iPhone 15",
    // 2022
    "iPhone 14 Pro Max",
    "iPhone 14 Pro",
    "iPhone 14 Plus",
    "iPhone 14",
    // 2021
    "iPhone 13 Pro Max",
    "iPhone 13 Pro",
    "iPhone 13",
    "iPhone 13 mini",
    // 2020
    "iPhone 12 Pro Max",
    "iPhone 12 Pro",
    "iPhone 12",
    "iPhone 12 mini",
    // SE within window
    "iPhone SE (3rd generation, 2022)",
  ],

  Samsung: [
    // S25 family (2025)
    "Galaxy S25 Ultra",
    "Galaxy S25+",
    "Galaxy S25",
    // S24 family (2024)
    "Galaxy S24 Ultra",
    "Galaxy S24+",
    "Galaxy S24",
    "Galaxy S24 FE",
    // S23 family (2023)
    "Galaxy S23 Ultra",
    "Galaxy S23+",
    "Galaxy S23",
    "Galaxy S23 FE",
    // S22 family (2022)
    "Galaxy S22 Ultra",
    "Galaxy S22+",
    "Galaxy S22",
    // S21 family (2021–2022 FE)
    "Galaxy S21 Ultra",
    "Galaxy S21+",
    "Galaxy S21",
    "Galaxy S21 FE",

    // Foldables (Z series) — 2021→2025
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
    // 2025 (Pixel 10 family)
    "Pixel 10 Pro Fold",
    "Pixel 10 Pro XL",
    "Pixel 10 Pro",
    "Pixel 10",
    // 2024 (Pixel 9 family)
    "Pixel 9 Pro Fold",
    "Pixel 9 Pro XL",
    "Pixel 9 Pro",
    "Pixel 9",
    "Pixel 9a",
    // 2023–2024
    "Pixel 8a",
    "Pixel 8 Pro",
    "Pixel 8",
    "Pixel Fold",
    // 2022–2023
    "Pixel 7a",
    "Pixel 7 Pro",
    "Pixel 7",
    // 2021–2022
    "Pixel 6a",
    "Pixel 6 Pro",
    "Pixel 6",
    "Pixel 5a (5G)",
  ],
};
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value;
    setBrand(newBrand);
    setModel(""); // reset model when brand changes
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setModel(newModel);
    setFormData({ ...formData, device: newModel });
  };

  const navigate = useNavigate();
  const [step, setStep] = useState<"signup" | "verify">("signup");

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
    device: "", // Added device property
  });

  const [verificationCode, setVerificationCode] = useState("")

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("")
    try {
        const response = await axios.post(`${baseURL}api/auth/confirm`, {
          email: formData.email,
          code: verificationCode
        });
          window.location.href = `${home}login`;
          
    } catch (err: any) {
      console.error("❌ Signup failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed.");
    }

  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      
      const response = await axios.post(`${baseURL}api/auth/signup`, {
        ...formData,
        address: `${formData.street} ${formData.city} ${formData.state} ${formData.zip}`
      });
      
      setStep("verify");
    } catch (err: any) {
      console.error("❌ Signup failed:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        {step === "signup" ? (
          <>
            <h2 className={styles.title}>Create Your Account</h2>
            <p className={styles.subtitle}>Sign up to get started with mRehab</p>

            <form onSubmit={handleSignup} className={styles.form}>
            {error && <p className={styles.error}>{error}</p>}

            <div>
                <label>Email</label>
                <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.input}
                required
                />
            </div>

            <div>
                <label>Password</label>
                <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
                />
            </div>

            <div className={styles.formGroupRow}>
                <div>
                <label>First Name</label>
                <input
                    name="givenName"
                    value={formData.givenName}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
                </div>
                <div>
                <label>Last Name</label>
                <input
                    name="familyName"
                    value={formData.familyName}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
                </div>
            </div>

            <div>
                <label>Gender</label>
                <input
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={styles.input}
                />
            </div>

            <div>
                <label>Are you a Patient or a Health Care provider</label>
                <select
                name="role"
                onChange={handleChange}
                className={styles.input}
                >
                  <option value="" disabled>Select your role</option>
                  <option value="patient">Patient</option>
                  <option value="provider">Health Care Provider</option>
                </select>
            </div>

            <div>
              <label>What Device Will You Use mRehab With?</label>

              {/* Brand Selector */}
              <select
                name="brand"
                value={brand}
                onChange={handleBrandChange}
                className={styles?.input}
              >
                <option value="" disabled>Select brand</option>
                {Object.keys(deviceOptions).map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>

              {/* Model Selector */}
              {brand && (
                <select
                  name="device"
                  value={model}
                  onChange={handleModelChange}
                  className={styles?.input}
                >
                  <option value="" disabled>Select model</option>
                  {deviceOptions[brand].map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              )}
            </div>

            

            <div>
                <label>Street Address</label>
                <input
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={styles.input}
                required
                />
            </div>

            <div className={styles.formGroupRow}>
                <div>
                <label>City</label>
                <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
                </div>
                <div>
                <label>State</label>
                <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
                </div>
                <div>
                <label>Zip Code</label>
                <input
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className={styles.input}
                    required
                />
                </div>
            </div>

            <button type="submit" className={styles.signupButton}>
                Sign Up
            </button>
            </form>


            <div className={styles.links}>
              <p>
                Already have an account?{" "}
                <span onClick={() => navigate("/login")}>Log In</span>
              </p>
            </div>
          </>
        ) : (
          <div className={styles.verification}>
            <h2 className={styles.title}>Verify Your Email</h2>
            <p className={styles.subtitle}>
              A verification link has been sent to <strong>{formData.email}</strong>.
              <br />
              Please check your inbox to activate your account.
            </p>
            <form onSubmit={handleVerify} className={styles.form}>
                {error && <p className={styles.error}>{error}</p>}
            <div>
                <label>Verifcation Code</label>
                <input
                    name="code"
                    type="text"
                    value={verificationCode}
                    onChange={e => setVerificationCode(e.target.value)}
                    className={styles.input}
                    required
                />
            </div>
            <button type="submit" className={styles.signupButton}>
                Sign Up
            </button>
            
            </form>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Signup;
