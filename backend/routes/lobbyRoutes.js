import { Router } from 'express';
const router = Router();
import { createRoom, getAllRooms, joinRoom, getRoomDetails } from '../controllers/lobbyController.js';

// Route for creating a room
router.post('/create', createRoom);

// Route for fetching all rooms
router.get('/', getAllRooms);

// Route for joining a room
router.post('/join', joinRoom);

// Route for getting room details by ID (for React to use when navigating to /room/:roomId)
router.get('/room/:roomId', getRoomDetails);

export default router;
