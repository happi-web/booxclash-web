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
  link: { type: String }, // General link for simulation, game, or VR/AR content
  thumbnail: { type: String, required: true },
  file: { type: String }, // File path for flashcards
});

// Create and export the Content model
const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
