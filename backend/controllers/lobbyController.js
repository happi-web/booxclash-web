// const Room = require("../models/Room"); // Room schema/model
// const jwt = require('jsonwebtoken');

// exports.createRoom = async (req, res) => {
//   try {
//     const { room_name, max_players, game_settings } = req.body;

//     // Get the token from headers
//     const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
//     if (!token) {
//       return res.status(400).json({ message: "No token provided." });
//     }

//     console.log("Token received:", token); // Log the token for debugging

//     // Verify and decode the token to get the user data
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     console.log("Decoded token:", decoded); // Log the decoded token for debugging

//     // Extract user details from the decoded token
//     const host_id = decoded.username; // Assuming 'username' is in the token
//     const host_profilePicture = decoded.profilePicture; // Default to placeholder if not in token

//     if (!host_id) {
//       return res.status(400).json({ message: "Host ID not found in token." });
//     }

//     const room = new Room({
//       room_id: new Date().getTime().toString(),
//       host_id, // Use the username as the host_id
//       room_name: room_name || "Untitled Room",
//       max_players: max_players || 4,
//       game_settings: game_settings || { difficulty: "medium", category: "general", rounds: 3 },
//       players: [{
//         player_id: decoded.id,  // Assuming `id` is the unique user ID from JWT
//         username: host_id,
//         profilePicture: host_profilePicture, // Store the host's profile picture or default
//         grade: decoded.grade || 'N/A',  // Default grade if not in token
//         country: decoded.country || 'Unknown',  // Default country if not in token
//         ready_status: false,
//         score: 0,
//         is_host: true,  // Host should have is_host set to true
//       }],
//       current_players: 1, // The host is already in the room
//     });

//     await room.save();
//     res.status(201).json({ room, message: "Room created successfully." });
//   } catch (error) {
//     console.error("Error creating room:", error);
//     res.status(500).json({ message: "Failed to create room." });
//   }
// };

// // Get all available rooms
// exports.getAllRooms = async (req, res) => {
//   try {
//     const rooms = await Room.find({ status: "waiting" });
//     res.json({ rooms });
//   } catch (error) {
//     console.error("Error fetching rooms:", error);
//     res.status(500).json({ message: "Failed to fetch rooms." });
//   }
// };

// exports.joinRoom = async (req, res) => {
//   try {
//     // Get token from the Authorization header
//     const token = req.headers.authorization.split(" ")[1];  // Extract token

//     // Verify the token using SECRET_KEY from the .env file
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);  // Use SECRET_KEY from env

//     // Extract player details from the decoded token
//     const { username, profilePicture, grade, country } = decoded;

//     const roomId = req.body.room_id;
//     const room = await Room.findOne({ room_id: roomId });

//     if (!room) {
//       return res.status(404).json({ message: 'Room not found' });
//     }

//     if (room.current_players >= room.max_players) {
//       return res.status(400).json({ message: 'Room is full' });
//     }

//     // Add player to the room
//     const newPlayer = {
//       player_id: decoded.id,  // Assuming `id` is the unique user ID from JWT
//       username,
//       profilePicture: profilePicture,  // Default to placeholder if not in token
//       grade: grade || 'N/A',  // Default grade if not in token
//       country: country || 'Unknown',  // Default country if not in token
//       ready_status: false,
//       score: 0,
//       is_host: false,  // This will be updated if the player is the host
//     };

//     room.players.push(newPlayer);
//     room.current_players += 1;

//     await room.save();

//     res.status(200).json({ message: 'Joined room successfully', room });
//   } catch (error) {
//     console.error("Error joining room:", error);
//     res.status(500).json({ message: 'Error joining room' });
//   }
// };


const Room = require('../models/Room');
const jwt = require('jsonwebtoken');

// Create room
exports.createRoom = async (req, res) => {
  try {
    const { room_name, max_players, game_settings } = req.body;

    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

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
};

// Get all available rooms
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "waiting" });
    res.json({ rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms." });
  }
};

// Join room
exports.joinRoom = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

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
};

// Fetch room details by ID
exports.getRoomDetails = async (req, res) => {
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
};
