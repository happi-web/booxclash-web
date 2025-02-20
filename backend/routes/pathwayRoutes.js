import express from "express";
import {
  getAllPathways,
  getNextPathway,  // Updated to use title
  createPathway,
  updatePathway,
  getPathwayByTitle,
  deletePathway,
  getPathwayBySubjectAndLesson,  // New function to get pathway by subject and lessonNumber
  getNextPathwayBySubjectAndLesson,  // New function for next pathway by subject and lessonNumber
} from "../controllers/pathwayController.js";

const router = express.Router();

router.get("/", getAllPathways);
router.get("/title/:title", getPathwayByTitle);
router.get("/subject/:subject/lesson/:lessonNumber", getPathwayBySubjectAndLesson); // New route for subject and lessonNumber
router.get("/next/title/:title", getNextPathway); // New route for next lesson by title
router.get("/next/subject/:subject/lesson/:lessonNumber", getNextPathwayBySubjectAndLesson); // New route for next lesson by subject and lessonNumber
router.post("/", createPathway);
router.patch("/:id", updatePathway);
router.delete("/:id", deletePathway);

export default router;
