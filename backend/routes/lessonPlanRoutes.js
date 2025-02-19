import { Router } from 'express';
import { uploadLessonPlan, getLessonPlans, deleteLessonPlan } from '../controllers/lessonPlanController.js';
import authenticate from '../middlewares/authMiddleware.js';
import multer from "multer";
const upload = multer({ dest: "uploads/" });
const router = Router();

// Route to upload a new lesson plan
router.post('/api/upload-lesson', authenticate, upload.array('flashcards'), uploadLessonPlan);

// Route to fetch all lesson plans
router.get('/api/lessons', authenticate, getLessonPlans);

// Route to delete a lesson plan by its lesson identifier
router.delete('/api/lessons/:lesson', authenticate, deleteLessonPlan);

export default router;
