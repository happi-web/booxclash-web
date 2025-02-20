import { Schema, model } from "mongoose";

const pathwaySchema = new Schema({
  topic: { type: String, required: true },
  subject: { type: String, required: true },
  lessonNumber: { type: String, required: true },
  points: { type: Number, enum: [50, 100, 200, 500, 1000], required: true },
  sections: {
    introduction: String,
    metaphor: String,
    lessonExplanation: String,
    video: String,
    guidedPractice: String,
    quiz: [{ question: String, options: [String], correctAnswer: String }],
    simulation: String,
    references: [String]
  }
});

export default model("Pathway", pathwaySchema);
