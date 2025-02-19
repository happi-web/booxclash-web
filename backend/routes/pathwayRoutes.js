import express from "express";
import {
  getAllPathways,
  getPathwayBySubject,
  getNextPathwayBySubject,
  getNextPathway,  // Updated to use title
  createPathway,
  updatePathway,
  getPathwayByTitle,
  deletePathway,
} from "../controllers/pathwayController.js";

const router = express.Router();

router.get("/", getAllPathways);
router.get("/title/:title", getPathwayByTitle);
router.get("/subject/:subject", getPathwayBySubject);
router.get("/next/title/:title", getNextPathway); // New route for next lesson by title
router.get("/next/subject/:subject/title/:currentTitle", getNextPathwayBySubject);
router.post("/", createPathway);
router.patch("/:id", updatePathway);
router.delete("/:id", deletePathway);

export default router;
