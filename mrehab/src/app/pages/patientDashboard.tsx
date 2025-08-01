import React from "react";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Navbar } from "../../components/Navbar";

export default function PatientDashboard() {
    const handleSignOut = () => {
        localStorage.removeItem("idToken");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    };
    useEffect(() => {
        const idToken = localStorage.getItem("idToken");
        if (idToken) {
            const user: any = jwtDecode(idToken);
            console.log(user);
            if (!user["cognito:groups"]?.includes("Patient") && !user["cognito:groups"]?.includes("patient")) {
                alert("You are not authorized to view this page.");
                handleSignOut();
            }
        }
        else {
            window.location.href = "/login"; // Redirect to login if not authenticated
        }
    }, []);

    return (
        <>
        <Navbar></Navbar>
        <div>
            <h1>Patient Dashboard</h1>
            <p>Coming soon...</p>
        </div>
        </>
    );
}


