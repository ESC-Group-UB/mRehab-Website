// server/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
// adding rate limiting and enforcing https
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

import authRoutes from "./routes/auth";
import awsRoutes from "./routes/database";
import AuthorizedUserRotes from "./routes/AuthorizedUsers";

const app = express();
const PORT = process.env.PORT || 5000;
export default app;

//configuring rate limiting
app.set("trust proxy", 1);
app.use(helmet());
app.use(rateLimit({ windowMs: 15*60*1000, max: 300 })); // tweak later

// Force HTTPS (works behind a proxy/ALB)
app.use((req, res, next) => {
  if (req.secure || req.headers["x-forwarded-proto"] === "https") return next();
  res.status(400).send("HTTPS required");
});

// Configure middlewares
app.use(express.json()); // ✅ This parses incoming JSON requests
app.use(cors());

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/aws", awsRoutes);
app.use("/api/authorizedUsers", AuthorizedUserRotes);

// Health check
app.get("/api/hello", (_req, res) => {
  console.log("hello called");
  res.send({ message: "Hello from backend" });
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
