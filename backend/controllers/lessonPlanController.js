const LessonPlan = require('../models/lessonPlanModel');
const fs = require('fs');  // For deleting flashcards from the file system if necessary

const uploadLessonPlan = async (req, res) => {
  try {
    const {
      gradeLevel, subject, topic, lesson, duration, learningObjectives,
      materialsNeeded, introduction, lessonPresentation, interactiveActivity,
      questionAnswerSession, videoLink, gameDescription, quizLink, gamesLink,
      conclusion
    } = req.body;

    // If files are provided, store the paths
    const flashcards = req.files ? req.files.map(file => file.path) : [];

    const newLessonPlan = new LessonPlan({
      gradeLevel, subject, topic, lesson, duration, learningObjectives,
      materialsNeeded, introduction, lessonPresentation, interactiveActivity,
      questionAnswerSession, videoLink, gameDescription, quizLink, gamesLink,
      conclusion, flashcards
    });

    await newLessonPlan.save();

    res.status(201).json({ message: 'Lesson plan uploaded successfully!', lessonPlan: newLessonPlan });
  } catch (error) {
    console.error('Error uploading lesson plan:', error);
    res.status(500).json({ message: 'Error uploading lesson plan. Please try again.' });
  }
};

const getLessonPlans = async (req, res) => {
  try {
    const lessons = await LessonPlan.find();
    res.status(200).json(lessons);
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ message: 'Error fetching lessons. Please try again.' });
  }
};

const deleteLessonPlan = async (req, res) => {
  try {
    const { lesson } = req.params;

    // Find and delete the lesson plan by lesson identifier
    const lessonPlan = await LessonPlan.findOneAndDelete({ lesson });

    if (!lessonPlan) {
      return res.status(404).json({ message: "Lesson plan not found" });
    }

    // Optional: Delete associated flashcards from the file system if stored locally
    lessonPlan.flashcards.forEach((flashcard) => {
      const filePath = flashcard;  // Assuming the file path is stored directly
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);  // Delete the flashcard file
      }
    });

    res.status(200).json({ message: "Lesson plan deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete lesson plan" });
  }
};

module.exports = { uploadLessonPlan, getLessonPlans, deleteLessonPlan };
