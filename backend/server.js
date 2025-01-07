const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173/booxclash-web", // Replace with your React app's URL
    methods: ["GET", "POST"],
  },
});

// Serve the React app's build folder
app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist", "index.html"));
});

let users = [
  { id: "1", name: "Mr. Smith", role: "teacher", isOnline: true },
  { id: "2", name: "Ms. Johnson", role: "teacher", isOnline: false },
  { id: "3", name: "Alice", role: "student", isOnline: true },
  { id: "4", name: "Bob", role: "student", isOnline: true },
];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send online users to the connected client
  socket.emit("onlineUsers", users);

  // Handle incoming messages
  socket.on("sendMessage", (message) => {
    console.log("Message received:", message);
    io.emit("receiveMessage", message); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(4000, () => {
  console.log("Server is running on http://localhost:4000");
});
