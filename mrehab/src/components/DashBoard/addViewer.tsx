import React, { useState } from "react";
import axios from "axios";

export default function AddViewer() {
  const baseURL = process.env.REACT_APP_BACKEND_API_URL;
  const api = "api/authorizedUsers/addAuthorizedUser";

  const [viewerEmail, setViewerEmail] = useState("");

  const checkEmail = async (email: string): Promise<boolean> => {
    try {
      const response = await axios.get(`${baseURL}api/auth/checkEmail`, {
        params: { email },
      });
      console.log("Email validity response:", response.data);
      return response.data.isValid;
    } catch (error) {
      console.error("Error checking email validity:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const idToken = localStorage.getItem("idToken");
    if (!idToken) {
      console.error("No token found");
      return;
    }

    const decoded = JSON.parse(atob(idToken.split(".")[1]));
    const currentUserEmail = decoded.email;

    const isValid = await checkEmail(viewerEmail);
    if (!isValid) {
      console.error("Invalid email address");
      return;
    }

    try {
      const response = await axios.post(`${baseURL}${api}`, {
        username: currentUserEmail,
        authorizedUser: viewerEmail,
      });
      console.log("✅ Viewer added:", response.data);
    } catch (error) {
      console.error("❌ Failed to add viewer:", error);
    }
  };

  return (
    <div>
      <h2>Add Viewer</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={viewerEmail}
          onChange={(e) => setViewerEmail(e.target.value)}
          placeholder="Enter viewer email"
          required
        />
        <button type="submit">Add Viewer</button>
      </form>
    </div>
  );
}
