import React, { useState } from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;
const home = process.env.REACT_APP_API_URL;


const LoginUser: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${baseURL}api/auth/login`, {
        email,
        password,
      });
      localStorage.setItem("accessToken", response.data?.AccessToken);
      localStorage.setItem("idToken", response.data.IdToken); // Optional: for decoding user info
      localStorage.setItem("tokenExpiry", (Date.now() + response.data.ExpiresIn * 1000).toString());
        // Redirect to dashboard or another page
        window.location.href = `${home}dashboard`; // Adjust the URL as needed
    } catch (err: any) {
      console.error("❌ Login failed:", err.response?.data || err.message);
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
        name="password"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginUser;
