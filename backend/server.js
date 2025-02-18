
const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lessonPlanRoutes = require("./routes/lessonPlanRoutes");
const studentUploadRoutes = require("./routes/studentUploadRoutes");
const studentProfileRoutes = require("./routes/studentsProfileRoutes");
const contentRoutes = require("./routes/contentRoutes");
const lobbyRoutes = require("./routes/lobbyRoutes");
const gameRoutes = require("./routes/gameRoutes");

require("dotenv").config();

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
app.use("/api", studentUploadRoutes);
app.use("/api", studentProfileRoutes);
app.use("/api", contentRoutes);
app.use("/api/lobby", lobbyRoutes);
app.use("/api/game", gameRoutes);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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


// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
