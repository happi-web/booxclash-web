const mongoose = require('mongoose');

// Define the schema for content
const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['video', 'simulation', 'game', 'vr_ar', 'flashcard'] 
  },
  videoLink: { type: String }, // Only for video type
  thumbnail: { type: String, required: true },
  file: { type: String }, // File path for simulation, game, or VR/AR
});

// Create and export the Content model
const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
