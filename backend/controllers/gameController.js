import Room from "../models/Room.js";

// Controller to get room details
export const getRoomDetails = async (req, res) => {
  try {
    const { room_id } = req.params;
    const room = await Room.findOne({ room_id });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({
      room_id: room.room_id,
      host_id: room.host_id,
      room_name: room.room_name,
      max_players: room.max_players,
      current_players: room.current_players,
      players: room.players,
      status: room.status,
      created_at: room.created_at,
      game_settings: room.game_settings, // Include game_settings in the response
    });
  } catch (error) {
    console.error("Error fetching room details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { getRoomDetails };
