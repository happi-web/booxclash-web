import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../css/knockout.css';

const socket = io('http://localhost:3000');

interface Player {
  id: string;
  name: string;
  health: number;
}

interface Question {
  id: number;
  problem: string;
  answer: number;
}

const MathMayhemMania: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);

  useEffect(() => {
    socket.on('updatePlayers', (updatedPlayers: Player[]) => {
      setPlayers(updatedPlayers);
    });

    socket.on('newQuestion', (question: Question) => {
      setCurrentQuestion(question);
    });

    socket.on('gameOver', () => {
      setIsGameActive(false);
      alert('Game Over!');
    });

    return () => {
      socket.off('updatePlayers');
      socket.off('newQuestion');
      socket.off('gameOver');
    };
  }, []);

  const handleAnswer = (answer: number) => {
    if (currentQuestion) {
      socket.emit('submitAnswer', { questionId: currentQuestion.id, answer });
    }
  };

  return (
    <div className="math-mayhem-mania">
      <h1>Math Mayhem Mania</h1>
      {!isGameActive && <button className="start-button" onClick={() => setIsGameActive(true)}>Start Game</button>}

      {isGameActive && currentQuestion && (
        <div className="question">
          <h2>{currentQuestion.problem}</h2>
          <input
            type="number"
            onChange={(e) => handleAnswer(Number(e.target.value))}
            placeholder="Your Answer"
            className="answer-input"
          />
        </div>
      )}

      <div className="players">
        {players.map((player) => (
          <div key={player.id} className="player">
            <h3>{player.name}</h3>
            <div className="health-bar">
              <div
                className="health"
                style={{ width: `${player.health}%`, backgroundColor: player.health > 50 ? 'green' : 'red' }}
              ></div>
            </div>
            <p>Health: {player.health}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MathMayhemMania;
