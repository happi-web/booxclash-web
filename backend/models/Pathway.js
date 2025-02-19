import { Schema, model } from "mongoose";

const pathwaySchema = new Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
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
