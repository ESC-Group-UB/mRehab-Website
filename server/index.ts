// server/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";

dotenv.config();

import authRoutes from "./routes/auth";
import awsRoutes from "./routes/database";

const app = express();
const PORT = process.env.PORT || 5000;
export default app;

// Configure middlewares
app.use(express.json()); // ✅ This parses incoming JSON requests
app.use(cors());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/aws", awsRoutes);

// Health check
app.get("/api/hello", (_req, res) => {
  console.log("hello called");
  res.send({ message: "Hello from backend" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
