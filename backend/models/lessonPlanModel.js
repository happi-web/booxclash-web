import { Schema, model } from 'mongoose';

const lessonPlanSchema = new Schema({
  gradeLevel: { type: String, required: true },
  subject: { type: String, required: true },
  topic: { type: String },
  lesson: { type: String, unique: true, required: true },
  duration: { type: String },
  learningObjectives: { type: String },
  materialsNeeded: { type: String },
  introduction: { type: String },
  lessonPresentation: { type: String },
  interactiveActivity: { type: String },
  questionAnswerSession: { type: String },
  videoLink: { type: String },
  gameDescription: { type: String },
  quizLink: { type: String },
  gamesLink: { type: String },
  conclusion: { type: String },
  flashcards: { type: [String] }, // Array of file paths for flashcards
  createdAt: { type: Date, default: Date.now }
});

const LessonPlan = model('LessonPlan', lessonPlanSchema);

export default LessonPlan;
