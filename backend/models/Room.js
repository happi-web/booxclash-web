import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  room_id: {
    type: String,
    required: true,
    unique: true,
  },
  host_id: {
    type: String,
    required: true,
  },
  room_name: {
    type: String,
    default: "Untitled Room",
  },
  status: {
    type: String,
    enum: ["waiting", "in_progress", "completed"],
    default: "waiting",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  max_players: {
    type: Number,
    default: 4,
  },
  current_players: {
    type: Number,
    default: 0,
  },
  players: [
    {
      player_id: String,
      username: String,
      profilePicture: String,  // Add profile picture field
      grade: String,           // Add grade field
      country: String,         // Add country field
      ready_status: {
        type: Boolean,
        default: false,
      },
      score: {
        type: Number,
        default: 0,
      },
      is_host: {
        type: Boolean,
        default: false,
      },
    },
  ],
  game_settings: {
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    category: {
      type: String,
      default: "general",
    },
    rounds: {
      type: Number,
      default: 3,
    },
  },
});

export default model("Room", roomSchema);
