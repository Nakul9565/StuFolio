import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth";
import studentRoutes from "./routes/students";
import mentorRoutes from "./routes/mentor";
import leaderboardRoutes from "./routes/leaderboard";
import eventRoutes from "./routes/events";
import notificationRoutes from "./routes/notifications";
import analysisRoutes from "./routes/analysis";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
    credentials: true,
}));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analysis", analysisRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 StuFolio API running at http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});

export default app;
