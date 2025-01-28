const express = require('express');
const router = express.Router();
const lobbyController = require('../controllers/lobbyController');

// Route for creating a room
router.post('/create', lobbyController.createRoom);

// Route for fetching all rooms
router.get('/', lobbyController.getAllRooms);

// Route for joining a room
router.post('/join', lobbyController.joinRoom);

// Route for getting room details by ID (for React to use when navigating to /room/:roomId)
router.get('/room/:roomId', lobbyController.getRoomDetails);

module.exports = router;
