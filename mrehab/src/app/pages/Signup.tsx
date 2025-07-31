import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";
import { Navbar } from "../../components/Navbar";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;
const home = process.env.REACT_APP_API_URL;

const Signup: React.FC = () => {
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
          console.log("✅ Signup successful:", response.data);
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
      console.log("✅ Signup successful:", response.data);
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
