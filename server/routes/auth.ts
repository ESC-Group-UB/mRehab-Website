// server/routes/auth.ts
// This route file defines user authentication endpoints (signup, confirm, login) 
// for interacting with AWS Cognito through the authService helper functions.

import express from "express";
import { signUpUser, confirmUser, loginUser, checkIfValidEmail, initiateForgotPassword, confirmForgotPassword } from "../AWS/authService";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;

const router = express.Router();

/**
 * POST /signup
 * Creates a new user in AWS Cognito with the provided user details.
 * Expects: email, password, givenName, familyName, gender, address
 * Returns: AWS Cognito signup result or an error message
 */
router.post("/signup", async (req, res) => {
  const { email, password, givenName, familyName, gender, address, role, device } = req.body;
  
  try {
    const result = await signUpUser(email, password, givenName, familyName, gender, address, role, device);
    res.json(result);
  } catch (err) {
    console.error("Signup error:", err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: errorMessage });
  }
});

/**
 * POST /confirm
 * Confirms a new user's account using the verification code sent via email.
 * Expects: email, code
 * Returns: success message or error
 */
router.post("/confirm", async (req, res) => {
  const { email, code } = req.body;
  try {
    await confirmUser(email, code);
    res.json({ message: "User confirmed successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: errorMessage });
  }
});

/**
 * POST /login
 * Authenticates a user using AWS Cognito.
 * Expects: email, password
 * Returns: AuthenticationResult object (AccessToken, IDToken, RefreshToken) or error
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const auth = await loginUser(email, password);
    
    res.json(auth.AuthenticationResult);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: errorMessage });
  }
});

/**
 * POST /forgot-password
 * Initiates the forgot password flow by sending a verification code to the user's email.
 * Expects: email
 * Returns: success message or error
 */
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    await initiateForgotPassword(email);
    // Don't reveal if email exists or not for security
    res.json({ message: "If an account exists with this email, a password reset code has been sent." });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    // Still return success message to prevent email enumeration
    console.error("Forgot password error:", errorMessage);
    res.json({ message: "If an account exists with this email, a password reset code has been sent." });
  }
});

/**
 * POST /confirm-forgot-password
 * Confirms the password reset with the verification code and sets the new password.
 * Expects: email, code, newPassword
 * Returns: success message or error
 */
router.post("/confirm-forgot-password", async (req, res) => {
  const { email, code, newPassword } = req.body;
  
  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: "Email, code, and new password are required" });
  }

  try {
    await confirmForgotPassword(email, code, newPassword);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: errorMessage });
  }
});

/**
 * GET /status
 * Dummy endpoint for checking if auth route is reachable.
 * Useful for health checks or development testing.
 */
router.get("/status", (req, res) => {
  res.json({ status: "User authentication status endpoint" });
});

export default router;
