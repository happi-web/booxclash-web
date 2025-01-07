import React, { useState, useEffect, useRef } from "react";
import "../css/backgroundGame.css";
import GameBackground from "./GameBackground";

const NumberHunt: React.FC = () => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetNumber, setTargetNumber] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gridNumbers, setGridNumbers] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNextRound, setIsNextRound] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // New state for mute functionality
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const backgroundMusic = useRef(new Audio("/booxclash-web/sound/back.mp3"));
  const successSound = useRef(new Audio("/booxclash-web/sound/success.mp3"));
  const wrongSound = useRef(new Audio("/booxclash-web/sound/wrong.mp3"));
  const gameOverSound = useRef(new Audio("/booxclash-web/sound/game-over.mp3"));
  const levelWinSound = useRef(new Audio("/booxclash-web/sound/level-win.mp3"));

  useEffect(() => {
    backgroundMusic.current.loop = true;
    backgroundMusic.current.volume = 0.1;

    return () => {
      clearInterval(timerRef.current as NodeJS.Timeout);
    };
  }, []);

  useEffect(() => {
    // Update volume of all sounds when mute state changes
    const volume = isMuted ? 0 : 1;
    backgroundMusic.current.volume = isMuted ? 0.1 * volume : 0.1; // Background music at lower volume
    successSound.current.volume = volume;
    wrongSound.current.volume = volume;
    gameOverSound.current.volume = volume;
    levelWinSound.current.volume = volume;
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const startGame = () => {
    if (!isMuted) backgroundMusic.current.play();
    resetGame();

    if (round === 1) {
      startRound1();
    } else if (round === 2) {
      startRound2();
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(0);
    setRound(1);
    if (!isMuted) backgroundMusic.current.play();
    setIsGameOver(false);
    setIsNextRound(false);
    setSelectedNumbers([]);
    setGridNumbers([]);
    setTargetNumber(0);
  };

  const startRound1 = () => {
    generateGridRound1();
    resetAndStartTimer();
  };

  const generateGridRound1 = () => {
    const numbers = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10));
    const target = numbers[Math.floor(Math.random() * numbers.length)];
    setGridNumbers(numbers);
    setTargetNumber(target);
  };

  const checkNumberRound1 = (clickedNumber: number) => {
    if (clickedNumber === targetNumber) {
      if (!isMuted) successSound.current.play();
      setScore((prev) => prev + 2);

      if (score + 2 >= 20) {
        if (!isMuted) levelWinSound.current.play();
        proceedToNextRound();
      } else {
        generateGridRound1();
        resetAndStartTimer();
      }
    } else {
      if (!isMuted) wrongSound.current.play();
      endGame();
    }
  };

  const proceedToNextRound = () => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    setIsNextRound(true);
    setTimeout(() => {
      setIsNextRound(false);
      setRound(2);
      startRound2();
    }, 2000);
  };

  const startRound2 = () => {
    generateGridRound2();
    resetAndStartTimer();
  };

  const generateGridRound2 = () => {
    const numbers = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10));
    const targetOptions: number[] = [];

    for (let i = 0; i < numbers.length; i++) {
      for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[i] + numbers[j] <= 20) {
          targetOptions.push(numbers[i] + numbers[j]);
        }
      }
    }

    if (targetOptions.length > 0) {
      const target = targetOptions[Math.floor(Math.random() * targetOptions.length)];
      setTargetNumber(target);
    } else {
      setTargetNumber(0);
    }
    setGridNumbers(numbers);
  };

  const checkNumberRound2 = (clickedNumber: number) => {
    setSelectedNumbers((prev) => [...prev, clickedNumber]);

    if (selectedNumbers.length === 1) {
      const sum = selectedNumbers[0] + clickedNumber;

      if (sum === targetNumber) {
        if (!isMuted) successSound.current.play();
        setScore((prev) => prev + 2);

        if (score + 2 >= 40) {
          if (!isMuted) levelWinSound.current.play();
          endGame();
        } else {
          generateGridRound2();
          resetAndStartTimer();
        }
      } else {
        if (!isMuted) wrongSound.current.play();
        endGame();
      }
      setSelectedNumbers([]);
    }
  };

  const resetAndStartTimer = () => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    setTimeLeft(30);
    startTimer();
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current as NodeJS.Timeout);
          if (!isMuted) gameOverSound.current.play();
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    backgroundMusic.current.pause();
    backgroundMusic.current.currentTime = 0;
    setIsGameOver(true);
  };

  return (
    <GameBackground title="Number Hunt">
      <div className="game-container">
        <div className="menu">
          {isGameOver && <p>Game Over! Final Score: {score}</p>}
          {isNextRound && <p>Next Round! Get Ready!</p>}
          <div className="game-info">
            <p>Target Number: {targetNumber}</p>
            <p>Time Left: {timeLeft}</p>
            <p>Score: {score}</p>
          </div>
        </div>

        <div className="number-grid">
          {gridNumbers.map((number, index) => (
            <button
              key={index}
              onClick={() =>
                round === 1 ? checkNumberRound1(number) : checkNumberRound2(number)
              }
              disabled={isGameOver || isNextRound}
            >
              {number}
            </button>
          ))}
        </div>
        <button onClick={startGame} disabled={isNextRound}>
          {isNextRound ? "Start Next Round" : "Start Game"}
        </button>
        <button onClick={resetGame}>Reset Game</button>
        <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
      </div>
    </GameBackground>
  );
};

export default NumberHunt;
