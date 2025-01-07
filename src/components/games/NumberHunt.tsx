import React, { useState, useEffect, useRef } from "react";
import "../css/backgroundGame.css"; // Assuming you have a CSS file for styling

const NumberHunt: React.FC = () => {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetNumber, setTargetNumber] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [gridNumbers, setGridNumbers] = useState<number[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isNextRound, setIsNextRound] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const backgroundMusic = useRef(new Audio("/booxclash-web/sound/back.mp3"));
  const successSound = useRef(new Audio("/booxclash-web/sound/success.mp3"));
  const wrongSound = useRef(new Audio("/booxclash-web/sound/wrong.mp3"));
  const gameOverSound = useRef(new Audio("/booxclash-web/sound/gameover.mp3"));
  const levelWinSound = useRef(new Audio("/booxclash-web/sound/levelwin.mp3"));

  useEffect(() => {
    backgroundMusic.current.loop = true;
    backgroundMusic.current.volume = 0.1;

    return () => {
      clearInterval(timerRef.current as NodeJS.Timeout);
    };
  }, []);

  const startGame = () => {
    backgroundMusic.current.play();
    resetGame();

    if (round === 1) {
      startRound1();
    } else {
      startRound2();
    }
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsNextRound(false);
    setSelectedNumbers([]);
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
      successSound.current.play();
      setScore((prev) => prev + 2);

      if (score + 2 >= 20) {
        levelWinSound.current.play();
        proceedToNextRound();
      } else {
        generateGridRound1();
        resetAndStartTimer();
      }
    } else {
      wrongSound.current.play();
      endGame();
    }
  };

  const proceedToNextRound = () => {
    clearInterval(timerRef.current as NodeJS.Timeout);
    setRound(2);
    setIsNextRound(true);
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
    }
    setGridNumbers(numbers);
  };

  const checkNumberRound2 = (clickedNumber: number) => {
    setSelectedNumbers((prev) => [...prev, clickedNumber]);

    if (selectedNumbers.length === 1) {
      const sum = selectedNumbers[0] + clickedNumber;

      if (sum === targetNumber) {
        successSound.current.play();
        setScore((prev) => prev + 2);

        if (score + 2 >= 40) {
          levelWinSound.current.play();
          endGame();
        } else {
          generateGridRound2();
          resetAndStartTimer();
        }
      } else {
        wrongSound.current.play();
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
          gameOverSound.current.play();
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
    <div className="game-container">
      <h1>Number Game</h1>
      {isGameOver && <p>Game Over! Final Score: {score}</p>}
      {isNextRound && <p>Next Round! Get Ready!</p>}
      <div className="game-info">
        <p>Target Number: {targetNumber}</p>
        <p>Time Left: {timeLeft}</p>
        <p>Score: {score}</p>
      </div>
      <div className="number-grid">
        {gridNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() =>
              round === 1 ? checkNumberRound1(number) : checkNumberRound2(number)
            }
          >
            {number}
          </button>
        ))}
      </div>
      <button onClick={startGame} disabled={isNextRound}>
        {isNextRound ? "Start Next Round" : "Start Game"}
      </button>
    </div>
  );
};

export default NumberHunt;
