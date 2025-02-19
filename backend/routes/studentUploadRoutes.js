import { Router } from "express";
import { getLessons, getLessonById, createLesson, updateLesson, deleteLesson } from "../controllers/studentContentController.js";

const router = Router();

router.get("/", getLessons);
router.get("/:id", getLessonById);
router.post("/", createLesson);
router.put("/:id", updateLesson);
router.delete("/:id", deleteLesson);

export default router;

