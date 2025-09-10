import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";
import { Navbar } from "../../components/Navbar";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;
const interestAPI = "api/aws/interest";

type FormData = {
  name: string;
  email: string;
  device: string;
  phone_case?: string;
  phone_case_link?: string;
  role: string;
  message?: string;
};

const deviceOptions: Record<string, string[]> = {
  iPhone: [
    "iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16","iPhone 16e",
    "iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15 Plus","iPhone 15",
    "iPhone 14 Pro Max","iPhone 14 Pro","iPhone 14 Plus","iPhone 14",
    "iPhone 13 Pro Max","iPhone 13 Pro","iPhone 13","iPhone 13 mini",
    "iPhone 12 Pro Max","iPhone 12 Pro","iPhone 12","iPhone 12 mini",
    "iPhone SE (3rd generation, 2022)",
  ],
  Samsung: [
    "Galaxy S25 Ultra","Galaxy S25+","Galaxy S25",
    "Galaxy S24 Ultra","Galaxy S24+","Galaxy S24","Galaxy S24 FE",
    "Galaxy S23 Ultra","Galaxy S23+","Galaxy S23","Galaxy S23 FE",
    "Galaxy S22 Ultra","Galaxy S22+","Galaxy S22",
    "Galaxy S21 Ultra","Galaxy S21+","Galaxy S21","Galaxy S21 FE",
    "Galaxy Z Fold7","Galaxy Z Flip7","Galaxy Z Flip7 FE",
    "Galaxy Z Fold6","Galaxy Z Flip6","Galaxy Z Fold5","Galaxy Z Flip5",
    "Galaxy Z Fold4","Galaxy Z Flip4","Galaxy Z Fold3","Galaxy Z Flip3",
  ],
  Google: [
    "Pixel 10 Pro Fold","Pixel 10 Pro XL","Pixel 10 Pro","Pixel 10",
    "Pixel 9 Pro Fold","Pixel 9 Pro XL","Pixel 9 Pro","Pixel 9","Pixel 9a",
    "Pixel 8a","Pixel 8 Pro","Pixel 8","Pixel Fold",
    "Pixel 7a","Pixel 7 Pro","Pixel 7",
    "Pixel 6a","Pixel 6 Pro","Pixel 6","Pixel 5a (5G)",
  ],
};

export default function IntrestForm() {
  const navigate = useNavigate();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    device: "",
    phone_case: "",
    phone_case_link: "",
    role: "",
    message: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newBrand = e.target.value;
    setBrand(newBrand);
    setModel("");
    setFormData((p) => ({ ...p, device: "" }));
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newModel = e.target.value;
    setModel(newModel);
    setFormData((p) => ({ ...p, device: newModel }));
  };
  
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (!baseURL) throw new Error("Missing REACT_APP_BACKEND_API_URL");
      await axios.post(`${baseURL}${interestAPI}`, formData);
      setSubmittedEmail(formData.email);
      setSubmitted(true);                        // <-- success state triggers thank-you view
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        {!submitted ? (
          <>
            <h2 className={styles.title}>Interest Form</h2>
            <p className={styles.subtitle}>Tell us a bit about you and your device.</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <p className={styles.error}>{error}</p>}

              <div className={styles.formGroupRow}>
                <div>
                  <label>Name</label>
                  <input
                    className={styles.input}
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Email</label>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Device selection (brand -> model) */}
              <div>
                <label>What device will you use mRehab with?</label>
                <select
                  name="brand"
                  value={brand}
                  onChange={handleBrandChange}
                  className={styles.input}
                  required
                >
                  <option value="" disabled>Select brand</option>
                  {Object.keys(deviceOptions).map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                {brand && (
                  <select
                    name="device"
                    value={model}
                    onChange={handleModelChange}
                    className={styles.input}
                    required
                  >
                    <option value="" disabled>Select model</option>
                    {deviceOptions[brand].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className={styles.formGroupRow}>
                <div>
                  <label>Do you use a phone case? (optional)</label>
                  <select
                    name="phone_case"
                    value={formData.phone_case}
                    onChange={handleChange}
                    className={styles.input}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>

                {formData.phone_case === "yes" && (
                  <div>
                    <label>Case link (Amazon/website)</label>
                    <input
                      className={styles.input}
                      name="phone_case_link"
                      value={formData.phone_case_link}
                      onChange={handleChange}
                      placeholder="https://example.com/your-case"
                    />
                  </div>
                )}
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
                <label>Message (optional)</label>
                <textarea
                  className={styles.input}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Any notes, therapy goals, or constraints we should know?"
                />
              </div>

              <button type="submit" className={styles.signupButton} disabled={submitting}>
                {submitting ? "Submitting..." : "Submit Interest"}
              </button>
            </form>
          </>
        ) : (
          // Success view (inputs hidden)
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <h2 className={styles.title}>Thanks you for expressing your interest!</h2>
            <p className={styles.subtitle}>
              We’ve received your intrest form at {submittedEmail ? ` at ${submittedEmail}` : ""}.
              <br />
              We’ll keep you updated on <strong>mRehab</strong>.
            </p>

            <button
              className={styles.signupButton}
              onClick={() => navigate("/")}
              style={{ marginTop: 16 }}
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
    </>

  );
}
