import React, { useState } from "react";
import styles from "./DeleteAccount.module.css";

const API_BASE = process.env.REACT_APP_BACKEND_API_URL;

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

const DeleteAccount: React.FC = () => {
  const [confirmText, setConfirmText] = useState<string>("");
  const [message, setMessage] = useState<Message>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const requiredConfirmText = "DELETE";

  const handleDeleteClick = (): void => {
    setShowConfirmation(true);
    setMessage(null);
  };

  const handleCancel = (): void => {
    setShowConfirmation(false);
    setConfirmText("");
    setMessage(null);
  };

  const handleDeleteSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setMessage(null);

    if (confirmText !== requiredConfirmText) {
      setMessage({
        type: "error",
        text: `Please type "${requiredConfirmText}" to confirm deletion.`,
      });
      return;
    }

    if (!API_BASE) {
      console.error("REACT_APP_BACKEND_API_URL is not set");
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
    try {
      const res = await fetch(`${API_BASE}api/accounts/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          message?: string;
        };
        throw new Error(data.message || "Failed to delete account");
      }

      // Clear local storage and redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("idToken");
      localStorage.removeItem("refreshToken");

      setMessage({
        type: "success",
        text: "Account deleted successfully. Redirecting...",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Failed to delete account";
      setMessage({ type: "error", text: message });
      setLoading(false);
    }
  };

  if (!showConfirmation) {
    return (
      <section className={styles.container}>
        <h2 className={styles.title}>Delete Account</h2>
        <div className={styles.warningBox}>
          <p className={styles.warningText}>
            Once you delete your account, there is no going back. This action
            will permanently delete your account and all associated data.
          </p>
        </div>
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDeleteClick}
        >
          Delete My Account
        </button>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Delete Account</h2>
      <div className={styles.warningBox}>
        <p className={styles.warningText}>
          <strong>Warning:</strong> This action cannot be undone. This will
          permanently delete your account, remove all of your data, and you will
          be logged out immediately.
        </p>
      </div>
      <form className={styles.form} onSubmit={handleDeleteSubmit}>
        <div className={styles.field}>
          <label htmlFor="confirmText" className={styles.label}>
            Type <strong>"{requiredConfirmText}"</strong> to confirm:
          </label>
          <input
            id="confirmText"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={requiredConfirmText}
            required
            className={styles.input}
            autoComplete="off"
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.deleteButton}
            disabled={loading || confirmText !== requiredConfirmText}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>

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

export default DeleteAccount;

