import React, { useState, useEffect } from "react";
import "../css/gameroom.css";

interface Player {
  username: string;
  grade: string;
  country: string;
  points: number;
}

interface GameSettings {
  difficulty: string;
  category: string;
  rounds: number;
}

interface RoomDetails {
  room_id: string;
  host_id: string;
  room_name: string;
  max_players: number;
  current_players: number;
  players: Player[];
  status: string;
  created_at: string;
  game_settings: GameSettings;
}

const GameRoom: React.FC = () => {
  const [roomDetails, setRoomDetails] = useState<RoomDetails | null>(null);
  const [questions, setQuestions] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);
  const [highlightedPods, setHighlightedPods] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        // Fetch room details
        const response = await fetch("http://localhost:4000/api/game/room/1737882325220");
        if (!response.ok) throw new Error("Failed to fetch room details");
        const data = await response.json();
        setRoomDetails(data);

        // Fetch questions from questions.json
        const questionsResponse = await fetch("/booxclash-web/questions.json");
        const questionsData = await questionsResponse.json();
        setQuestions(questionsData);
      } catch (error) {
        console.error("Error fetching room details or questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      // Randomly pair two players and highlight their pods
      if (!roomDetails?.players || roomDetails.players.length < 2) return;

      // Randomly select two players
      const randomPlayerIndexes = [
        Math.floor(Math.random() * roomDetails.players.length),
        Math.floor(Math.random() * roomDetails.players.length),
      ];
    
      setHighlightedPods(new Set(randomPlayerIndexes));
    }
  }, [timer, roomDetails]);

  const renderPods = (players: Player[], maxPlayers: number) => {
    const pods = [];
    for (let i = 0; i < maxPlayers; i++) {
      const isHighlighted = highlightedPods.has(i); // Check if this pod is highlighted
      if (i < players.length) {
        pods.push(
          <div
            className={`pod ${isHighlighted ? "highlighted" : ""}`} // Add class if highlighted
            key={i}
          >
            <div className="pods-details">
              <img src="/booxclash-web/images/logo.png" alt="Player Picture" />
              <div className="details">
                <span>Name: {players[i].username}</span>
                <span>Grade: {players[i].grade}</span>
                <span>Country: {players[i].country}</span>
                <span>Points: {players[i].points} pts</span>
              </div>
            </div>
            <div className="energy-bar"></div>
          </div>
        );
      } else {
        pods.push(
          <div className="pod empty" key={i}>
            <div className="pods-details">
              <div className="details">
                <span>Waiting for player...</span>
              </div>
            </div>
            <div className="energy-bar"></div>
          </div>
        );
      }
    }
    return pods;
  };

  const handleAnswerSelection = (selectedOption: string) => {
    // Check if roomDetails and players are available, and if grade exists
    if (roomDetails?.players[0]?.grade && questions) {
      const currentQuestion = questions.Math[roomDetails.players[0].grade]?.[currentQuestionIndex];
  
      // If the current question exists, proceed
      if (currentQuestion) {
        if (selectedOption === currentQuestion.correctAnswer) {
          setScore(score + 1); // Increment score for correct answer
          alert("Correct answer!"); // Alert for correct answer
        } else {
          alert("Wrong answer! Try again."); // Alert for wrong answer
        }
      
        // Move to the next question
        if (currentQuestionIndex < questions.Math[roomDetails.players[0].grade].length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          alert("You've completed all the questions!");
        }
      } else {
        console.error("No question found for the given grade or index.");
      }
    } else {
      console.error("Room details or player grade is undefined.");
    }
  };

  const renderQuestions = (grade: string) => {
    if (questions && questions.Math[grade]) {
      const currentQuestion = questions.Math[grade][currentQuestionIndex];
      return (
        <div className="question">
          <p>{currentQuestion.question}</p>
          <ul>
            {currentQuestion.options.map((option: string, idx: number) => (
              <li key={idx} onClick={() => handleAnswerSelection(option)}>
                {option}
              </li>
            ))}
          </ul>
        </div>
      );
    } else {
      return <p>No questions available for this grade.</p>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomDetails) {
    return <div>Failed to load game room details.</div>;
  }

  return (
    <div className="bodyGameRoom">
      <div className="game-container">
        {/* Timer and Grade Panel */}
        <div className="grade-timer">
          <div className="booxclash">
            <h1>BOOXCLASH SMACKDOWN</h1>
            <h1 className="timer">{timer < 10 ? `00:0${timer}` : `00:${timer}`}</h1>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <ul>
            {roomDetails.players.map((player, index) => (
              <li key={index}>
                <span>{player.username}</span>
                <span>{player.points} pts</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Game Details */}
        <div className="game-details">
          <h2>Game Details</h2>
          <div className="host">Host: {roomDetails.host_id}</div>
          <div className="room">Room: {roomDetails.room_name}</div>
          <div className="subject">Status: {roomDetails.status}</div>
          <div className="spectators">Max Players: {roomDetails.max_players}</div>
          {roomDetails.game_settings && (
            <div className="settings">
              <p>Difficulty: {roomDetails.game_settings.difficulty}</p>
              <p>Category: {roomDetails.game_settings.category}</p>
              <p>Rounds: {roomDetails.game_settings.rounds}</p>
            </div>
          )}
        </div>

        {/* Main Battle Ring */}
        <div className="battle-ring">
          <div className="inner-ring">
            <div className="question-display">
              <h2>Ready to start the game?</h2>
              {/* Render questions based on the first player's grade */}
              {roomDetails.players.length > 0 && renderQuestions(roomDetails.players[0].grade)}
              <button>Start Game</button>
            </div>
          </div>

          <div className="pod-background-bottom">
            <div className="pod-left">
              {renderPods(
                roomDetails.players.slice(0, Math.ceil(roomDetails.max_players / 2)),
                Math.ceil(roomDetails.max_players / 2)
              )}
            </div>
          </div>

          <div className="pod-background-top">
            <div className="pod-top">
              {renderPods(
                roomDetails.players.slice(Math.ceil(roomDetails.max_players / 2)),
                Math.floor(roomDetails.max_players / 2)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoom;
