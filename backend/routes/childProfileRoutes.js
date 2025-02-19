import { Router } from "express";
import { getChildProfile } from "../controllers/childProfileController.js";

const router = Router();

// Route to get a child profile by username
router.get("/profile/:username", getChildProfile);

export default router;
