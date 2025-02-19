import express from "express";
import cors from "cors";
import path from "path";
import http from "http";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import lessonPlanRoutes from "./routes/lessonPlanRoutes.js";
import studentUploadRoutes from "./routes/studentUploadRoutes.js";
import studentProfileRoutes from "./routes/studentsProfileRoutes.js";
import contentRoutes from "./routes/contentRoutes.js";
import lobbyRoutes from "./routes/lobbyRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import childProfileRoutes from "./routes/childProfileRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import pathwayRoutes from "./routes/pathwayRoutes.js";

import dotenv from "dotenv";
dotenv.config();

// Initialize app and server
const app = express();
const server = http.createServer(app);

// Set up CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // ✅ Allow both origins
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use(authRoutes);
app.use(userRoutes);
app.use(lessonPlanRoutes);
app.use("/api/lessons", studentUploadRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api", studentProfileRoutes);
app.use("/api", contentRoutes);
app.use("/api/lobby", lobbyRoutes);
app.use("/api/pathways", pathwayRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/children", childRoutes);
app.use("/api/profile", childProfileRoutes);

// Serve static files
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("start_game", (data) => {
    // Emit game started to all players in the room
    io.to(data.roomId).emit("game_started", { roomId: data.roomId });
  });

  // Other socket events...

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Increase payload size limit
app.use(bodyParser.json({ limit: "10mb" })); // Adjust as needed
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
