import { Schema, model } from "mongoose";

const LessonSchema = new Schema({
  title: {
    type: String,
    required: true,
    match: /^Lesson\s\d+/, // Ensures title starts with "Lesson" followed by a number
  },
  introduction: { type: String, required: true },
  videoLink: { type: String, required: true },
  flashcardRoute: { type: String, required: true },
  guidedPractice: { type: String, required: true },
  quiz: [
    {
      question: { type: String, required: true },
      options: { type: [String], required: true }, // Array of options
      correctAnswer: { type: String, required: true }, // Correct answer
    },
  ],
  simulationRoute: { type: String, required: true },
  otherReferences: { type: String, required: true },
  pathway: {
    type: String,
    enum: ['science', 'math', 'both'], // Enforcing valid values
    required: true, // Assuming it is required
  },
  level: {
    type: Number,
    min: 1,
    max: 5,
    required: true, // Assuming it is required
  },
});

export default model("Lesson", LessonSchema);
