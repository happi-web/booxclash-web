import { Router } from "express";
import { getLessons } from "../controllers/lessonController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; // Protect routes

const router = Router();

router.get("/", authenticate, getLessons); // Fetch lessons (protected route)

export default router;
