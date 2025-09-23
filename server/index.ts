// server/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

import authRoutes from "./routes/auth";
import awsRoutes from "./routes/database";
import AuthorizedUserRotes from "./routes/AuthorizedUsers";
import uploadSessionRoutes from "./routes/uploadSession";
import stripeRoutes from "./routes/stripe";
import stripeWebhookRoutes from "./routes/stripeWebhooks";
import ordersRoutes from "./routes/orders";

const app = express();
const PORT = process.env.PORT || 5000;
export default app;

// Configure middlewares
app.use(cors());
app.use("/api/stripeWebhook", stripeWebhookRoutes);
app.use(express.json()); // ✅ This parses incoming JSON requests



// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/aws", awsRoutes);
app.use("/api/authorizedUsers", AuthorizedUserRotes);
app.use("/api/uploadSession", uploadSessionRoutes);
app.use("/api/stripe", stripeRoutes);
app.use("/api/orders", ordersRoutes);

// Health check
app.get("/api/hello", (_req, res) => {
  
  res.send({ message: "Hello from backend" });
});



// Start server
app.listen(PORT, () => {
  
});
