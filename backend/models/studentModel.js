const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ["video", "simulation", "game", "vr_ar"] },
  link: { type: String }, // For video and simulation
  thumbnail: { type: String }, // For game and VR/AR
  component: { type: String }, // For game (e.g., NumberHunt)
});

module.exports = mongoose.model("Content", contentSchema);
