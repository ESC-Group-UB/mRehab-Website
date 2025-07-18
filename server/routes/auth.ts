// server/routes/auth.ts
import express from "express";
import { signUpUser, confirmUser, loginUser } from "../AWS/authService";

const baseURL = process.env.REACT_APP_BACKEND_API_URL;

const router = express.Router();

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


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const auth = await loginUser(email, password);
    console.log("Login successful:");
    res.json(auth.AuthenticationResult); // contains ID token, Access token, Refresh token
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: errorMessage });
  }
});

router.get("/status", (req, res) => {
  res.json({ status: "User authentication status endpoint" });
});

export default router;
