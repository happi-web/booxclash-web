import Lesson from "../models/studentModel.js";

// Fetch all lessons
export async function getLessons(req, res) {
  try {
    const lessons = await Lesson.find(); // Ensure you reference the correct model method
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
}

// Fetch a single lesson by ID
export async function getLessonById(req, res) {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lesson" });
  }
}

// Save lesson
export async function createLesson(req, res) {
  try {
    const {
      title,
      introduction,
      videoLink,
      flashcardRoute,
      guidedPractice,
      quiz,
      simulationRoute,
      otherReferences,
      pathway, // Include pathway field
      level,    // Include level field
    } = req.body;

    // Validate title starts with "Lesson" + number
    if (!/^Lesson\s\d+/.test(title)) {
      return res.status(400).json({ error: "Title must start with 'Lesson' followed by a number." });
    }

    // Validate quiz format
    if (!Array.isArray(quiz) || quiz.length === 0) {
      return res.status(400).json({ error: "Quiz must be an array with at least one question." });
    }

    // Validate pathway field
    const validPathways = ['science', 'math', 'both'];
    if (!validPathways.includes(pathway)) {
      return res.status(400).json({ error: "Pathway must be one of the following: 'science', 'math', or 'both'." });
    }

    // Validate level field (must be between 1 and 5)
    if (typeof level !== 'number' || level < 1 || level > 5) {
      return res.status(400).json({ error: "Level must be a number between 1 and 5." });
    }

    // Create new lesson
    const newLesson = new Lesson({
      title,
      introduction,
      videoLink,
      flashcardRoute,
      guidedPractice,
      quiz,
      simulationRoute,
      otherReferences,
      pathway,
      level,
    });

    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ error: "Failed to save lesson" });
  }
}

// Update lesson
export async function updateLesson(req, res) {
  try {
    const { pathway, level } = req.body;

    // Validate pathway field if it's provided
    if (pathway && !['science', 'math', 'both'].includes(pathway)) {
      return res.status(400).json({ error: "Pathway must be one of the following: 'science', 'math', or 'both'." });
    }

    // Validate level field if it's provided
    if (level && (typeof level !== 'number' || level < 1 || level > 5)) {
      return res.status(400).json({ error: "Level must be a number between 1 and 5." });
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json(updatedLesson);
  } catch (error) {
    res.status(500).json({ error: "Failed to update lesson" });
  }
}

// Delete lesson
export async function deleteLesson(req, res) {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.json({ message: "Lesson deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lesson" });
  }
}
