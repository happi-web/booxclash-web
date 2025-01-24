// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel"); // Assuming you have a User model

// let lobby = [];
// let gradeLevel = null;

// const joinLobby = async (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) {
//       console.error("No token provided.");
//       return res.status(401).json({ message: "Authorization token missing." });
//     }

//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     const { username, grade } = decoded;

//     console.log("Decoded token:", decoded);

//     // Fetch user from database by username
//     const user = await User.findOne({ username });
//     if (!user) {
//       console.error("User not found with username:", username);
//       return res.status(404).json({ message: "User not found." });
//     }

//     console.log("User details fetched from DB:", { username: user.username, grade: user.grade });

//     // Set grade level for the lobby
//     if (lobby.length === 0) {
//       gradeLevel = grade;
//       console.log("Grade level set to:", gradeLevel);
//     }

//     // Validate grade level
//     if (grade !== gradeLevel) {
//       console.error(`Grade mismatch. Lobby grade: ${gradeLevel}, User grade: ${grade}`);
//       return res.status(400).json({
//         message: `Players must be in the same grade. Current lobby is for grade ${gradeLevel}.`,
//       });
//     }

//     // Prevent duplicate entries
//     if (lobby.find((player) => player.username === username)) {
//       console.error("Player already in lobby:", username);
//       return res.status(400).json({ message: "Player is already in the lobby." });
//     }

//     // Add user to lobby
//     lobby.push({ username, grade });
//     console.log("Player added to lobby:", username);

//     // If lobby is full
//     if (lobby.length === 4) {
//       console.log("Lobby full. Game is ready to start.");
//       return res.status(200).json({ gameReady: true, players: lobby });
//     }

//     // Return lobby status
//     return res.status(200).json({ gameReady: false, players: lobby });
//   } catch (error) {
//     console.error("Error in joinLobby:", error.message);
//     res.status(500).json({ message: "Internal server error." });
//   }
// };


// const getLobby = (req, res) => {
//   return res.status(200).json({ players: lobby, gradeLevel });
// };

// const resetLobby = (req, res) => {
//   lobby = [];
//   gradeLevel = null;
//   return res.status(200).json({ message: "Lobby reset successfully." });
// };

// module.exports = { joinLobby, getLobby, resetLobby };


const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Assuming you have a User model

let lobby = [];
let gradeLevel = null;

const joinLobby = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      console.error("No token provided.");
      return res.status(401).json({ message: "Authorization token missing." });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { username, grade } = decoded;

    console.log("Decoded token:", decoded);

    // Fetch user from database by username
    const user = await User.findOne({ username });
    if (!user) {
      console.error("User not found with username:", username);
      return res.status(404).json({ message: "User not found." });
    }

    console.log("User details fetched from DB:", {
      username: user.username,
      grade: user.grade,
      country: user.country,
      profilePicture: user.profilePicture,
    });

    // Set grade level for the lobby
    if (lobby.length === 0) {
      gradeLevel = grade;
      console.log("Grade level set to:", gradeLevel);
    }

    // Validate grade level
    if (grade !== gradeLevel) {
      console.error(`Grade mismatch. Lobby grade: ${gradeLevel}, User grade: ${grade}`);
      return res.status(400).json({
        message: `Players must be in the same grade. Current lobby is for grade ${gradeLevel}.`,
      });
    }

    // Prevent duplicate entries
    if (lobby.find((player) => player.username === username)) {
      console.error("Player already in lobby:", username);
      return res.status(400).json({ message: "Player is already in the lobby." });
    }

    // Add user to lobby with additional details
    lobby.push({
      username,
      grade,
      country: user.country || "Unknown",
      profilePicture: user.profilePicture || "/default-profile.png", // Default profile picture
    });

    console.log("Player added to lobby:", username);

    // If lobby is full
    if (lobby.length === 4) {
      console.log("Lobby full. Game is ready to start.");
      return res.status(200).json({ gameReady: true, players: lobby });
    }

    // Return lobby status
    return res.status(200).json({ gameReady: false, players: lobby });
  } catch (error) {
    console.error("Error in joinLobby:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

const getLobby = (req, res) => {
  return res.status(200).json({ players: lobby, gradeLevel });
};

const resetLobby = (req, res) => {
  lobby = [];
  gradeLevel = null;
  return res.status(200).json({ message: "Lobby reset successfully." });
};

module.exports = { joinLobby, getLobby, resetLobby };
