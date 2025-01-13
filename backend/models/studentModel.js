const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ["video", "simulation", "game", "vr_ar", "flashcard"] },
  link: { type: String }, // Accept any link
  thumbnail: { type: String },
  file: { type: String },
});

module.exports = mongoose.model("Content", contentSchema);
