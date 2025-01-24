// import React, { useState, useEffect } from "react";
// import "../css/gameroom.css";

// interface Question {
//   question: string;
//   options: string[];
//   correctAnswer: string;
// }

// const GameRoom: React.FC = () => {
//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     // Fetch questions from questions.json
//     fetch("questions.json")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Failed to fetch questions");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setQuestions(data);
//       })
//       .catch((error) => console.error(error));
//   }, []);

//   const currentQuestion = questions[currentIndex];

//   const handleNextQuestion = () => {
//     if (currentIndex < questions.length - 1) {
//       setCurrentIndex(currentIndex + 1);
//     } else {
//       console.log("End of questions!");
//     }
//   };

//   return (
//     <div className="bodyGameRoom">
//     <div className="game-container">
//       {/* Timer and Grade Panel */}
//       <div className="grade-timer">
//         <div className="booxclash">
//           <h1>BOOXCLASH SMACKDOWN</h1>
//         </div>
//         <div className="top-timer">
//           <div className="grade">Grade: 5</div>
//           <div className="timer">00:30</div>
//         </div>
//       </div>

//       {/* Leaderboard */}
//       <div className="leaderboard">
//         <h2>Leaderboard</h2>
//         <ul>
//           <li><span>Player 1</span><span>1200 pts</span></li>
//           <li><span>Player 2</span><span>1100 pts</span></li>
//           <li><span>Player 3</span><span>1000 pts</span></li>
//         </ul>
//       </div>

//       {/* Main Battle Ring */}
//       <div className="battle-ring">
//         <div className="question-display">
//           {currentQuestion ? (
//             <>
//               <h2>{currentQuestion.question}</h2>
//               <ul>
//                 {currentQuestion.options.map((option, index) => (
//                   <li key={index}>{option}</li>
//                 ))}
//               </ul>
//               <button onClick={handleNextQuestion}>Next Question</button>
//             </>
//           ) : (
//             <p>Loading question...</p>
//           )}
//         </div>
//         <div className="profile-placeholders-top">
//           {Array(2).fill(null).map((_, idx) => <div key={idx} className="placeholder"></div>)}
//         </div>
//         <div className="profile-placeholders-bottom">
//           {Array(2).fill(null).map((_, idx) => <div key={idx} className="placeholder"></div>)}
//         </div>
//       </div>

//       {/* Player Pods */}
//       <div className="pod-left">
//         {renderPods(["Player 1", "Player 2", "Player 3", "Player 4"], ["6", "6", "6", "6"], ["USA", "UK", "USA", "UK"])}
//       </div>
//     </div>
//     </div>
//   );
// };

// const renderPods = (names: string[], grades: string[], countries: string[]) => {
//   return names.map((name, index) => (
//     <div className="pod" key={index}>
//       <img src="/booxclash-web/images/logo.png" alt="Player Picture" />
//       <div className="energy-bar" style={{ width: "100%" }}></div>
//       <div className="details">
//         <span>Name: {name}</span>
//         <span>Grade: {grades[index]}</span>
//         <span>Country: {countries[index]}</span>
//       </div>
//     </div>
//   ));
// };

// export default GameRoom;

import React, { useState, useEffect } from "react";
import "../css/gameroom.css";
import axios from "axios";

interface Player {
  username: string;
  grade: string;
  country: string;
  profilePicture: string;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const GameRoom: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Fetch questions from questions.json
    fetch("questions.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch questions");
        }
        return response.json();
      })
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => console.error(error));

    // Fetch players from the backend
    const fetchPlayers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:4000/api/lobby", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlayers(response.data.players);
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      console.log("End of questions!");
    }
  };

  return (
    <div className="bodyGameRoom">
      <div className="game-container">
        {/* Timer and Grade Panel */}
        <div className="grade-timer">
          <div className="booxclash">
            <h1>BOOXCLASH SMACKDOWN</h1>
          </div>
          <div className="top-timer">
            <div className="grade">Grade: {players[0]?.grade || "Loading..."}</div>
            <div className="timer">00:30</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="leaderboard">
          <h2>Leaderboard</h2>
          <ul>
            {players.map((player, index) => (
              <li key={index}>
                <span>{player.username}</span>
                <span>0 pts</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Battle Ring */}
        <div className="battle-ring">
          <div className="question-display">
            {currentQuestion ? (
              <>
                <h2>{currentQuestion.question}</h2>
                <ul>
                  {currentQuestion.options.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
                <button onClick={handleNextQuestion}>Next Question</button>
              </>
            ) : (
              <p>Loading question...</p>
            )}
          </div>
          <div className="profile-placeholders-top">
            {players.slice(0, 2).map((player, idx) => (
              <div key={idx} className="placeholder">
                      <img
                          src={
                            player.profilePicture
                              ? `http://localhost:4000/${player.profilePicture.replace("\\", "/")}`
                              : "https://via.placeholder.com/150"
                          }
                          alt="Profile"
                          style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                        />
              </div>
            ))}
          </div>
          <div className="profile-placeholders-bottom">
            {players.slice(2).map((player, idx) => (
              <div key={idx} className="placeholder">
                      <img
        src={
                player.profilePicture
                          ? `http://localhost:4000/${player.profilePicture.replace("\\", "/")}`
                          : "https://via.placeholder.com/150"
                      }
                      alt="Profile"
                      style={{ width: "70px", height: "70px", borderRadius: "50%" }}
                    />
              </div>
            ))}
          </div>
        </div>

        {/* Player Pods */}
        <div className="pod-left">
          {renderPods(players)}
        </div>
      </div>
    </div>
  );
};

const renderPods = (players: Player[]) => {
  return players.map((player, index) => (
    <div className="pod" key={index}>
      <img
        src={
          player.profilePicture
            ? `http://localhost:4000/${player.profilePicture.replace("\\", "/")}`
            : "https://via.placeholder.com/150"
        }
        alt="Profile"
        style={{ width: "70px", height: "70px", borderRadius: "50%" }}
      />
      <div className="energy-bar" style={{ width: "100%" }}></div>
      <div className="details">
        <span>Name: {player.username}</span>
        <span>Grade: {player.grade}</span>
        <span>Country: {player.country}</span>
      </div>
    </div>
  ));
};

export default GameRoom;
