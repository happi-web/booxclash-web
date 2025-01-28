const express = require("express");
const { getRoomDetails } = require("../controllers/gameController");

const router = express.Router();

// Route to get room details
router.get("/room/:room_id", getRoomDetails);

module.exports = router;
