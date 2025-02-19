import { Router } from "express";
import { getRoomDetails } from "../controllers/gameController.js";

const router = Router();

// Route to get room details
router.get("/room/:room_id", getRoomDetails);

export default router;
