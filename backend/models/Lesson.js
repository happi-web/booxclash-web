import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  introduction: { type: String, required: true },
  videoLink: { type: String, required: true },
  flashcardRoute: { type: String, required: true },
  guidedPractice: { type: String, required: true },
  quiz: { type: Array, required: true },
  simulationRoute: { type: String, required: true },
  otherReferences: { type: String, required: true },
});

const Lesson = mongoose.model("Lesson Details", LessonSchema);
export default Lesson;
