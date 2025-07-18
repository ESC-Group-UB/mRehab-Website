import React, { useState } from "react";
import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_API_URL; 

const SignupButton: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    givenName: "",
    familyName: "",
    gender: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${baseURL}api/auth/signup`, formData);
      console.log("✅ Signup successful:", response.data);
    } catch (err: any) {
      console.error("❌ Signup failed:", err.response?.data || err.message);
    }
  };

  return (
    <div>
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} type="password" />
      <input name="givenName" placeholder="First Name" onChange={handleChange} />
      <input name="familyName" placeholder="Last Name" onChange={handleChange} />
      <input name="gender" placeholder="Gender" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} /> 
      {/* need to split this into street adress, citty, state and zip code */}
      
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignupButton;
