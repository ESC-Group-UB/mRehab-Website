import React from "react";
import SignupButton from "../../components/auth/signupform";
import LoginUser from "../../components/auth/login";
import ConfirmUser from "../../components/auth/ConfirmUser";


export default function Login() {
  return (
    <div className="login-page">
        <h1>login</h1>
        <LoginUser />
        <h1>Register</h1>
        <SignupButton />
        <h1>confirm</h1>
        <ConfirmUser />
        
      {/* Add your login form or components here */}
    </div>
  );
}