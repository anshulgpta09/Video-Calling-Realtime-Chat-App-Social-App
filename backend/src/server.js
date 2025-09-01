import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

// ======================
// Load Environment Variables
// ======================
dotenv.config();

// Debug: check loaded env
console.log("Loaded ENV:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  STREAM_API_KEY: process.env.STREAM_API_KEY,
  STREAM_API_SECRET: process.env.STREAM_API_SECRET ? "****" : undefined, // mask secret
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ======================
// Middlewares
// ======================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5176"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ======================
// Routes
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// ======================
// Production build serve
// ======================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ======================
// Start Server
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  connectDB();
});
