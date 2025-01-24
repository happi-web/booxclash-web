const jwt = require("jsonwebtoken");

let currentQuestion = null;
let players = [];
let winner = null;

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle game start from the frontend
    socket.on("startGame", (gamePlayers) => {
      players = gamePlayers.map((p) => ({ ...p, eliminated: false, score: 0 }));
      winner = null;
      io.emit("gameStarted", { players });
    });

    // Handle pairing of players
    socket.on("pairPlayers", (pair) => {
      io.emit("newPair", pair);
    });

    // Receive question from frontend and broadcast it
    socket.on("sendQuestion", (question) => {
      currentQuestion = question;
      io.emit("newQuestion", { question });
      io.emit("resetTimer", 20); // Reset timer
    });

    // Handle answer submission
    socket.on("submitAnswer", ({ playerId, selectedOption }) => {
      if (!currentQuestion) return;

      const correctAnswer = currentQuestion.answer;
      const isCorrect = selectedOption === correctAnswer;

      const playerIndex = players.findIndex((p) => p.id === playerId);
      if (playerIndex === -1) return;

      if (players[playerIndex].eliminated) return;

      if (isCorrect) {
        players[playerIndex].score += 10;
        io.emit("correctAnswer", { playerId });
      } else {
        players[playerIndex].eliminated = true;
        io.emit("playerEliminated", { playerId, name: players[playerIndex].name });
      }

      // Check if only one player remains
      const remainingPlayers = players.filter((p) => !p.eliminated);
      if (remainingPlayers.length === 1) {
        winner = remainingPlayers[0].name;
        io.emit("gameOver", { winner });
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocket };
