
import React, { useEffect, useState } from "react";
import styles from "./ChangePasswordForm.module.css";

const API_BASE = process.env.REACT_APP_BACKEND_API_URL;

interface PasswordFormState {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

type Message =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

/**
 * Get tokens from localStorage or redirect to /login.
 * Returns accessToken (for API calls).
 */
function getTokensOrRedirect(): { accessToken: string } | null {
  const accessToken = localStorage.getItem("accessToken");
  const idToken = localStorage.getItem("idToken");

  if (!accessToken && !idToken) {
    window.location.href = "/login";
    return null;
  }

  return {
    // Prefer accessToken but fall back to idToken for safety
    accessToken: accessToken ?? (idToken as string),
  };
}

const ChangePasswordForm: React.FC = () => {
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState<Message>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Optional: simple auth check on mount
  useEffect(() => {
    getTokensOrRedirect();
  }, []);

  const handlePasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setPasswordMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      return;
    }

    if (!API_BASE) {
      console.error("REACT_APP_BACKEND_API_URL is not set");
      setPasswordMessage({
        type: "error",
        text: "Internal error: API base URL is not configured.",
      });
      return;
    }

    const tokens = getTokensOrRedirect();
    if (!tokens) return;
    const { accessToken } = tokens;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}api/accounts/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(data.message || "Failed to change password");
      }

      setPasswordMessage({
        type: "success",
        text: "Password changed successfully.",
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to change password";
      setPasswordMessage({ type: "error", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Change Password</h2>
      <form className={styles.form} onSubmit={handlePasswordSubmit}>
        <div className={styles.field}>
          <label htmlFor="currentPassword" className={styles.label}>
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="newPassword" className={styles.label}>
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordChange}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmNewPassword" className={styles.label}>
            Confirm New Password
          </label>
          <input
            id="confirmNewPassword"
            type="password"
            name="confirmNewPassword"
            value={passwordForm.confirmNewPassword}
            onChange={handlePasswordChange}
            required
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {passwordMessage && (
          <p
            className={
              passwordMessage.type === "error"
                ? styles.messageError
                : styles.messageSuccess
            }
          >
            {passwordMessage.text}
          </p>
        )}
      </form>
    </section>
  );
};

export default ChangePasswordForm;
