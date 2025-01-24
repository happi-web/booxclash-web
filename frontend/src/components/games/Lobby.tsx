// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// interface Player {
//   username: string;
//   grade: string;
//   country:string;
//   profilePicture:[File];
// }

// const Knockout = () => {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [message, setMessage] = useState("");
//   const [gameReady, setGameReady] = useState(false);
//   const [gradeLevel, setGradeLevel] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleJoinLobby = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const joinResponse = await axios.post(
//         "http://localhost:4000/api/lobby/join",
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setPlayers(joinResponse.data.players);
//       setGameReady(joinResponse.data.gameReady);
//       setGradeLevel(joinResponse.data.gradeLevel);

//       if (joinResponse.data.gameReady) {
//         navigate("/GameRoom");
//       }
//     } catch (error: any) {
//       setMessage(error.response?.data?.message || "Error joining the lobby.");
//     }
//   };

//   useEffect(() => {
//     const fetchLobby = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get<{ players: Player[]; gradeLevel: string }>("http://localhost:4000/api/lobby", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setPlayers(response.data.players);
//         setGradeLevel(response.data.gradeLevel);

//         if (response.data.players.length >= 4) {
//           setGameReady(true);
//           navigate("/GameRoom");
//         }
//       } catch (error) {
//         console.error("Error fetching lobby:", error);
//       }
//     };

//     fetchLobby();
//     const interval = setInterval(fetchLobby, 3000); // Poll every 3 seconds

//     return () => clearInterval(interval);
//   }, [navigate]);

//   return (
//     <div>
//       <h1>Welcome to Knockout</h1>
//       <h2>Lobby</h2>
//       {message && <p style={{ color: "red" }}>{message}</p>}
//       <div>
//         <button onClick={handleJoinLobby} disabled={gameReady || players.length >= 4}>
//           Join Lobby
//         </button>
//       </div>
//       <div>
//         <h3>Players in Lobby:</h3>
//         <ul>
//           {players.map((player, index) => (
//             <li key={index}>{player.username} (Grade: {player.grade})</li>
//           ))}
//         </ul>
//         {gradeLevel && <p>Grade Level: {gradeLevel}</p>}
//       </div>
//     </div>
//   );
// };

// export default Knockout;

// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// interface Player {
//   username: string;
//   grade: string;
//   profilePicture: string; // New field for profile picture
// }

// const Knockout = () => {
//   const [players, setPlayers] = useState<Player[]>([]);
//   const [message, setMessage] = useState("");
//   const [gameReady, setGameReady] = useState(false);
//   const [gradeLevel, setGradeLevel] = useState<string | null>(null);
//   const navigate = useNavigate();

//   const handleJoinLobby = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const joinResponse = await axios.post(
//         "http://localhost:4000/api/lobby/join",
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setPlayers(joinResponse.data.players);
//       setGameReady(joinResponse.data.gameReady);
//       setGradeLevel(joinResponse.data.gradeLevel);

//       if (joinResponse.data.gameReady) {
//         navigate("/GameRoom");
//       }
//     } catch (error: any) {
//       setMessage(error.response?.data?.message || "Error joining the lobby.");
//     }
//   };

//   useEffect(() => {
//     const fetchLobby = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const response = await axios.get<{
//           players: Player[];
//           gradeLevel: string;
//         }>("http://localhost:4000/api/lobby", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setPlayers(response.data.players);
//         setGradeLevel(response.data.gradeLevel);

//         if (response.data.players.length >= 4) {
//           setGameReady(true);
//           navigate("/GameRoom");
//         }
//       } catch (error) {
//         console.error("Error fetching lobby:", error);
//       }
//     };

//     fetchLobby();
//     const interval = setInterval(fetchLobby, 3000); // Poll every 3 seconds

//     return () => clearInterval(interval);
//   }, [navigate]);

//   return (
//     <div>
//       <h1>Welcome to Knockout</h1>
//       <h2>Lobby</h2>
//       {message && <p style={{ color: "red" }}>{message}</p>}
//       <div>
//         <button onClick={handleJoinLobby} disabled={gameReady || players.length >= 4}>
//           Join Lobby
//         </button>
//       </div>
//       <div>
//         <h3>Players in Lobby:</h3>
//         <ul>
//           {players.map((player, index) => (
//             <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
//               <img
//                 src={player.profilePicture}
//                 alt={`${player.username}'s profile`}
//                 style={{
//                   width: "40px",
//                   height: "40px",
//                   borderRadius: "50%",
//                   marginRight: "10px",
//                 }}
//               />
//               {player.username} (Grade: {player.grade})
//             </li>
//           ))}
//         </ul>
//         {gradeLevel && <p>Grade Level: {gradeLevel}</p>}
//       </div>
//     </div>
//   );
// };

// export default Knockout;
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Player {
  username: string;
  grade: string;
  country: string;
  profilePicture: string; // URL to the profile picture
}

const Knockout = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [message, setMessage] = useState("");
  const [gameReady, setGameReady] = useState(false);
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJoinLobby = async () => {
    try {
      const token = localStorage.getItem("token");

      const joinResponse = await axios.post(
        "http://localhost:4000/api/lobby/join",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlayers(joinResponse.data.players);
      setGameReady(joinResponse.data.gameReady);
      setGradeLevel(joinResponse.data.gradeLevel);

      if (joinResponse.data.gameReady) {
        navigate("/GameRoom");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error joining the lobby.");
    }
  };

  useEffect(() => {
    const fetchLobby = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get<{ players: Player[]; gradeLevel: string }>(
          "http://localhost:4000/api/lobby",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setPlayers(response.data.players);
        setGradeLevel(response.data.gradeLevel);

        if (response.data.players.length >= 4) {
          setGameReady(true);
          navigate("/GameRoom");
        }
      } catch (error) {
        console.error("Error fetching lobby:", error);
      }
    };

    fetchLobby();
    const interval = setInterval(fetchLobby, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Knockout</h1>
      <h2>Lobby</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <div>
        <button onClick={handleJoinLobby} disabled={gameReady || players.length >= 4}>
          Join Lobby
        </button>
      </div>
      <div>
        <h3>Players in Lobby:</h3>
        <ul>
          {players.map((player, index) => (
            <li key={index} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
      <img
        src={
          player.profilePicture
            ? `http://localhost:4000/${player.profilePicture.replace("\\", "/")}`
            : "https://via.placeholder.com/150"
        }
        alt="Profile"
        style={{ width: "50px", height: "50px", borderRadius: "50%" }}
      />
              <div>
                <p>
                  <strong>{player.username}</strong> (Grade: {player.grade})
                </p>
                <p style={{ fontSize: "0.9rem", color: "gray" }}>Country: {player.country}</p>
              </div>
            </li>
          ))}
        </ul>
        {gradeLevel && <p>Grade Level: {gradeLevel}</p>}
      </div>
    </div>
  );
};

export default Knockout;
