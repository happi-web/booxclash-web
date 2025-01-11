const express = require('express');
const { uploadLessonPlan, getLessonPlans, deleteLessonPlan } = require('../controllers/lessonPlanController');
const authenticate = require('../middlewares/authMiddleware');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Route to upload a new lesson plan
router.post('/api/upload-lesson', authenticate, upload.array('flashcards'), uploadLessonPlan);

// Route to fetch all lesson plans
router.get('/api/lessons', authenticate, getLessonPlans);

// Route to delete a lesson plan by its lesson identifier
router.delete('/api/lessons/:lesson', authenticate, deleteLessonPlan);

module.exports = router;
