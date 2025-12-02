import React, { use } from "react";
import { useEffect } from "react";
import { Navbar } from "../../../components/Navbar";

export default function ProfilePage() {
    useEffect(() => {
        console.log("ProfilePage mounted");
        const idToken = localStorage.getItem("idToken");
        if (!idToken) {
            window.location.href = "/login"; // Redirect to login page if not logged in
        }
    }, []);

  return (
    
    <>
        <Navbar />
        <div>
            Profile Page
        </div>
    </>
  );
}