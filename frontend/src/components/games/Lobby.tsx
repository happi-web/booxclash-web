import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";

// Initialize socket connection (adjust the URL if needed)
const socket = io("http://localhost:4000");

interface Room {
  room_id: string;
  room_name: string;
  status: string;
  current_players: number;
  max_players: number;
  host_id: string;
  game_settings: {
    difficulty: string;
    category: string;
    rounds: number;
  };
  players: Array<{
    player_id: string;
    username: string;
    profilePicture: string;
    grade: string;
    country: string;
    score: number;
    is_host: boolean;
  }>;
}

const Lobby: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("math");
  const [rounds, setRounds] = useState(3);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
const decodedToken = token ? jwtDecode<any>(token) : null;
const currentUserId = decodedToken?.id; // Make sure this matches the backend player_id


  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/lobby");
      setRooms(response.data.rooms);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Error fetching rooms.");
      } else {
        setError("Unable to fetch rooms. Please try again later.");
      }
    }
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/api/lobby/create",
        {
          room_name: roomName || "Untitled Room",
          max_players: maxPlayers,
          game_settings: { difficulty, category, rounds },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newRoom = response.data.room;
      navigate(`/room/${newRoom.room_id}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Error creating room.");
      } else {
        setError("Error creating room.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    const token = localStorage.getItem("token");
    const decodedToken = token ? jwtDecode<any>(token) : null;
    const username = decodedToken?.username;

    const room = rooms.find((r) => r.room_id === roomId);
    const isPlayerAlreadyInRoom = room?.players.some((player) => player.username === username);

    if (isPlayerAlreadyInRoom) {
      setError("You are already in this room.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/lobby/join",
        { room_id: roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedRoom = response.data.room;

      // Check if room is full, then navigate to the Game Room
      if (updatedRoom.current_players === updatedRoom.max_players) {
        navigate(`/room/${updatedRoom.room_id}`); // Navigate to the Game Room
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Error joining room.");
      } else {
        setError("Error joining room.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = (roomId: string) => {
    // Emit the event to start the game
    socket.emit("start_game", { roomId });
  };

  useEffect(() => {  
    fetchRooms(); // Fetch rooms initially
  
    const interval = setInterval(fetchRooms, 5000); // Refresh room list every 5 seconds
  
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    rooms.forEach((room) => {
      const isUserInRoom = room.players.some((player) => player.player_id === currentUserId);
      if (isUserInRoom && room.current_players === room.max_players) {
        navigate(`/game-room/${room.room_id}`);
      }
    });
  }, [rooms, navigate]);
  

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 5000); // Refresh room list every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">BooxClash Lobby</h1>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <div className="mt-6 p-4 border rounded-lg shadow">
        <h2 className="text-lg font-semibold">Create a Room</h2>
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="border p-2 rounded"
          />
          <div>
            <label>Max Players:</label>
            <select
              value={maxPlayers}
              onChange={(e) => setMaxPlayers(Number(e.target.value))}
              className="border p-2 ml-2 rounded"
            >
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
            </select>
          </div>
          <div>
            <label>Difficulty:</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border p-2 ml-2 rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label>Category:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border p-2 ml-2 rounded"
            >
              <option value="math">Math</option>
              <option value="science">Science</option>
            </select>
          </div>
          <div>
            <label>Rounds:</label>
            <input
              type="number"
              value={rounds}
              onChange={(e) => setRounds(Number(e.target.value))}
              className="border p-2 ml-2 rounded"
            />
          </div>
          <button
            onClick={handleCreateRoom}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Available Rooms</h2>
        <div className="mt-4">
          {rooms.length === 0 ? (
            <p>No rooms available. Create one to get started!</p>
          ) : (
<ul className="space-y-4">
  {rooms.map((room) => {
    const isCurrentUserHost = room.players.some(
      (player) => player.is_host && player.player_id === currentUserId
    );

    return (
      <li
        key={room.room_id}
        className="p-4 border rounded-lg shadow flex justify-between items-center"
      >
        <div>
          <h3 className="text-md font-bold">{room.room_name}</h3>
          <p>Players: {room.current_players}/{room.max_players}</p>
          <p>Difficulty: {room.game_settings.difficulty}</p>
        </div>
        <button
          onClick={() => handleJoinRoom(room.room_id)}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={room.current_players >= room.max_players || loading}
        >
          Join
        </button>

        {/* Show "Start Game" button only if the current user is the host */}
        {room.current_players === room.max_players && isCurrentUserHost && (
          <button
            onClick={() => handleStartGame(room.room_id)}
            className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Start Game
          </button>
        )}
      </li>
    );
  })}
</ul>

          )}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Players</h2>
        {rooms.map((room) =>
          room.players.length > 0 ? (
            <ul key={room.room_id}>
              {room.players.map((player) => (
                <li
                  key={player.player_id}
                  className="p-4 border rounded-lg shadow flex justify-between items-center"
                >
                  <div className="flex items-center">
                    <div>
                      <p className="font-bold">{player.username}</p>
                      <p>{player.grade} | {player.country}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p>Score: {player.score}</p>
                    {player.is_host && (
                      <span className="text-sm text-green-500">Host</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No players in this room yet.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Lobby;
