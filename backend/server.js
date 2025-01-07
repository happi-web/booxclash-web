import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the React frontend
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '../build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Game logic
let players = [];
let questions = [
  { id: 1, problem: '5 + 3', answer: 8 },
  { id: 2, problem: '12 - 4', answer: 8 },
  { id: 3, problem: '9 x 3', answer: 27 },
];
let currentQuestionIndex = 0;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  players.push({ id: socket.id, name: `Player ${players.length + 1}`, health: 100 });
  io.emit('updatePlayers', players);

  socket.on('submitAnswer', ({ questionId, answer }) => {
    const correctAnswer = questions.find((q) => q.id === questionId)?.answer;
    const player = players.find((p) => p.id === socket.id);

    if (correctAnswer === answer) {
      player.health = Math.min(player.health + 10, 100);
    } else {
      player.health -= 10;
    }

    io.emit('updatePlayers', players);

    if (player.health <= 0) {
      io.emit('gameOver');
      players = [];
    }
  });

  socket.on('disconnect', () => {
    players = players.filter((p) => p.id !== socket.id);
    io.emit('updatePlayers', players);
  });
});

setInterval(() => {
  if (players.length > 1 && currentQuestionIndex < questions.length) {
    io.emit('newQuestion', questions[currentQuestionIndex]);
    currentQuestionIndex++;
  }
}, 10000);

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
