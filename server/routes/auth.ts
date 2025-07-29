// server/routes/auth.ts
// This route file defines user authentication endpoints (signup, confirm, login) 
// for interacting with AWS Cognito through the authService helper functions.

import express from "express";
import { signUpUser, confirmUser, loginUser, checkIfValidEmail } from "../AWS/authService";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;

const router = express.Router();

/**
 * POST /signup
 * Creates a new user in AWS Cognito with the provided user details.
 * Expects: email, password, givenName, familyName, gender, address
 * Returns: AWS Cognito signup result or an error message
 */
router.post("/signup", async (req, res) => {
  const { email, password, givenName, familyName, gender, address } = req.body;
  try {
    const result = await signUpUser(email, password, givenName, familyName, gender, address);
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
    console.log("Login successful:");
    res.json(auth.AuthenticationResult);
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
