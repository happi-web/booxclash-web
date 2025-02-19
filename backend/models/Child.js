import mongoose from "mongoose";

const ChildSchema = new mongoose.Schema({
  username: { type: String, required: true },
  grade: { type: String, required: true },
  years: { type: Number, required: true },
  password: { type: String, required: true },
  subjects: { type: [String], required: true },
  profilePicture: { type: String, required: false }, // Optional field for profile picture URL
  role: { type: String, default: "student" }, // Default role is "student"
});

export default mongoose.model("Child", ChildSchema);
