import React, { useEffect, useState } from "react";
import styles from "./UpdateInfoForm.module.css";
import { jwtDecode } from "jwt-decode";

const API_BASE = process.env.REACT_APP_BACKEND_API_URL;

interface DecodedToken {
  email?: string;
  given_name?: string;
  family_name?: string;
  address?:
    | string
    | {
        street?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        formatted?: string;
        [key: string]: unknown;
      };
  [key: string]: unknown;
}

interface AddressState {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

type Message =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

function getTokensOrRedirect(): { accessToken: string; idToken?: string } | null {
  const accessToken = localStorage.getItem("accessToken");
  const idToken = localStorage.getItem("idToken");

  if (!accessToken && !idToken) {
    window.location.href = "/login";
    return null;
  }

  return {
    accessToken: accessToken ?? (idToken as string),
    idToken: idToken ?? undefined,
  };
}

const UpdateInfoForm: React.FC = () => {
  const [given_name, setgiven_name] = useState<string>("");
  const [last_name, setlast_name] = useState<string>("");
  const [address, setAddress] = useState<AddressState>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [message, setMessage] = useState<Message>(null);
  const [loading, setLoading] = useState(false);

  // Prefill from ID token if available
  useEffect(() => {
    const tokens = getTokensOrRedirect();
    if (!tokens || !tokens.idToken) return;

    try {
      const decoded = jwtDecode<DecodedToken>(tokens.idToken);
      if (decoded.given_name) setgiven_name(decoded.given_name);
      if (decoded.family_name) setlast_name(decoded.family_name);

      const addr = decoded.address;
      if (addr && typeof addr === "object") {
        setAddress((prev) => ({
          street: (addr.street as string) ?? prev.street,
          city: (addr.city as string) ?? prev.city,
          state: (addr.state as string) ?? prev.state,
          zipCode: (addr.postalCode as string) ?? prev.zipCode,
        }));
      }
      // If your address is stored differently (e.g. in Dynamo only),
      // you can later swap this prefill to a GET /api/accounts/info call.
    } catch (err) {
      console.warn("Failed to decode ID token for UpdateInfoForm:", err);
    }
  }, []);

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    if (!API_BASE) {
      setMessage({
        type: "error",
        text: "Internal error: API base URL is not configured.",
      });
      return;
    }

    const tokens = getTokensOrRedirect();
    if (!tokens) return;
    const { accessToken } = tokens;

    setLoading(true);
    console.log("Submitting updated info:", { given_name, last_name, address });
    try {
      const res = await fetch(`${API_BASE}api/accounts/update-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          given_name,
          last_name,
          address: {
            street: address.street,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
          },
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(data.message || "Failed to update info");
      }

      setMessage({
        type: "success",
        text: "Information updated successfully.",
      });
    } catch (err) {
      console.error(err);
      const text =
        err instanceof Error ? err.message : "Failed to update information";
      setMessage({ type: "error", text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Update Your Info</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        {/* First / Last Name row */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="given_name">
              First Name
            </label>
            <input
              id="given_name"
              className={styles.input}
              type="text"
              value={given_name}
              onChange={(e) => setgiven_name(e.target.value)}
              placeholder="First name"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="last_name">
              Last Name
            </label>
            <input
              id="last_name"
              className={styles.input}
              type="text"
              value={last_name}
              onChange={(e) => setlast_name(e.target.value)}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        {/* Street Address */}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="street">
            Street Address
          </label>
          <input
            id="street"
            className={styles.input}
            type="text"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            placeholder="123 Main St"
          />
        </div>

        {/* City / State / Zip row */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="city">
              City
            </label>
            <input
              id="city"
              className={styles.input}
              type="text"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
              placeholder="City"
            />
          </div>

          <div className={styles.fieldSmall}>
            <label className={styles.label} htmlFor="state">
              State
            </label>
            <input
              id="state"
              className={styles.input}
              type="text"
              name="state"
              value={address.state}
              onChange={handleAddressChange}
              placeholder="NY"
              maxLength={2}
            />
          </div>

          <div className={styles.fieldSmall}>
            <label className={styles.label} htmlFor="zipCode">
              Zip Code
            </label>
            <input
              id="zipCode"
              className={styles.input}
              type="text"
              name="zipCode"
              value={address.zipCode}
              onChange={handleAddressChange}
              placeholder="10001"
            />
          </div>
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {message && (
          <p
            className={
              message.type === "error"
                ? styles.messageError
                : styles.messageSuccess
            }
          >
            {message.text}
          </p>
        )}
      </form>
    </section>
  );
};

export default UpdateInfoForm;
