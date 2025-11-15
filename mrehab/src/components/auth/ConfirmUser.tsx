import React, { useState } from "react";
import axios from "axios";


const baseURL = process.env.REACT_APP_BACKEND_API_URL;

const ConfirmUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleConfirm = async () => {
    try {
      const response = await axios.post(`${baseURL}api/auth/confirm`, {
        email,
        code,
      });
      
    } catch (err: any) {
      console.error("❌ Confirmation failed:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <input
        name="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        name="code"
        placeholder="Verification Code"
        onChange={(e) => setCode(e.target.value)}
      />
      <button onClick={handleConfirm}>Confirm Account</button>
    </div>
  );
};

export default ConfirmUser;
