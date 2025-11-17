// server/app.ts
import express from "express";
import cors from "cors";
// loading env varibles
import dotenv from "dotenv";
dotenv.config();


import authRoutes from "./routes/auth";
import awsRoutes from "./routes/database";
import AuthorizedUserRotes from "./routes/AuthorizedUsers";
import uploadSessionRoutes from "./routes/uploadSession";
import stripeRoutes from "./routes/stripe";
import stripeWebhookRoutes from "./routes/stripeWebhooks";
import ordersRoutes from "./routes/orders";
import AIRouter from "./routes/AI";



const app = express();

// ===== Middlewares =====
app.use(cors());

// Stripe webhook BEFORE express.json() if you need raw body
app.use("/api/stripeWebhook", stripeWebhookRoutes);

// Parses incoming JSON requests
app.use(express.json());

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/aws", awsRoutes);
app.use("/api/authorizedUsers", AuthorizedUserRotes);
app.use("/api/uploadSession", uploadSessionRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/AI", AIRouter);

// Health check
app.get("/api/hello", (_req, res) => {
  res.send({ message: "Hello from backend" });
});

export default app;
