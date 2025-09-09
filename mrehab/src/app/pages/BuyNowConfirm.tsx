import React, { useEffect, useState } from "react";

export default function BuyNowConfirm() {
  const [displayName, setDisplayName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [device, setDevice] = useState("");

  const baseURL = process.env.REACT_APP_BACKEND_API_URL;

  async function getDevice(email: string) {
    try {
      console.log("Fetching device for:", email);
      const res = await fetch(`${baseURL}api/aws/user-settings?email=${email}`);
      const data = await res.json();
      if (data?.Device) {
        setDevice(data.Device);
      }
    } catch (err) {
      console.error("Error fetching device:", err);
    }
  }

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (idToken) {
      // Decode JWT payload
      const user = JSON.parse(atob(idToken.split(".")[1]));
      console.log("Decoded token:", user);

      const name = user.given_name || user.name || "User";
      const email = user.email || "No email found";
      const phone = user.phone_number || "No phone number found";
      const addr = user.address.formatted || "No address found";

      setDisplayName(name);
      setUserEmail(email);
      setPhoneNumber(phone);
      setAddress(addr);
    } else {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    if (userEmail) {
      getDevice(userEmail);
    }
  }, [userEmail]);

  return (
    <div>
      <h2>Buy Now Confirmation</h2>
      <p><strong>Name:</strong> {displayName}</p>
      <p><strong>Email:</strong> {userEmail}</p>
      <p><strong>Phone:</strong> {phoneNumber}</p>
      <p><strong>Address:</strong> {address}</p>
      <p><strong>Device:</strong> {device || "Loading..."}</p>

      {/* button to call the stripe checkout page */}
      <button
        onClick={async () => {
          try { fetch(`${baseURL}api/stripe/create-checkout-session`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json", 
            },
            body: JSON.stringify({ email: userEmail, device:device }),
          })  .then((res) => res.json())
          .then((data) => {
            if (data.url) {
              window.location.href = data.url;
            } else {
              console.error("No URL returned from backend");
            } })
          } catch (err) {
            console.error("Error initiating checkout:", err);
          } }}
      >
        Proceed to Payment
      </button>
    </div>
  );
}
