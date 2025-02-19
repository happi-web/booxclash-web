import Room from '../models/Room.js';
import pkg from 'jsonwebtoken';
const { verify } = pkg;

// Create room
export async function createRoom(req, res) {
  try {
    const { room_name, max_players, game_settings } = req.body;

    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    const decoded = verify(token, process.env.SECRET_KEY);

    const host_id = decoded.username;
    const host_profilePicture = decoded.profilePicture;

    const room = new Room({
      room_id: new Date().getTime().toString(),
      host_id,
      room_name: room_name || "Untitled Room",
      max_players: max_players || 4,
      game_settings: game_settings || { difficulty: "medium", category: "general", rounds: 3 },
      players: [{
        player_id: decoded.id,
        username: host_id,
        profilePicture: host_profilePicture,
        grade: decoded.grade || 'N/A',
        country: decoded.country || 'Unknown',
        ready_status: false,
        score: 0,
        is_host: true,
      }],
      current_players: 1,
      status: 'waiting', // Set the status as "waiting" when room is created
    });

    await room.save();
    res.status(201).json({ room, message: "Room created successfully." });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Failed to create room." });
  }
}

// Get all available rooms
export async function getAllRooms(req, res) {
  try {
    const rooms = await Room.find({ status: "waiting" });
    res.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms." });
  }
}

// Join room
export async function joinRoom(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = verify(token, process.env.SECRET_KEY);

    const { room_id } = req.body;
    const room = await Room.findOne({ room_id });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.current_players >= room.max_players) {
      return res.status(400).json({ message: 'Room is full' });
    }

    const newPlayer = {
      player_id: decoded.id,
      username: decoded.username,
      profilePicture: decoded.profilePicture,
      grade: decoded.grade || 'N/A',
      country: decoded.country || 'Unknown',
      ready_status: false,
      score: 0,
      is_host: false,
    };

    room.players.push(newPlayer);
    room.current_players += 1;

    await room.save();

    res.status(200).json({ message: 'Joined room successfully', room });
  } catch (error) {
    console.error("Error joining room:", error);
    res.status(500).json({ message: 'Error joining room' });
  }
}

// Fetch room details by ID
export async function getRoomDetails(req, res) {
  try {
    const { roomId } = req.params; // Get roomId from the URL params
    const room = await Room.findOne({ room_id: roomId });

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ message: 'Error fetching room details' });
  }
}
