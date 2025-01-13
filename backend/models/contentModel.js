const mongoose = require('mongoose');

// Define the schema for the content
const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
  },
  type: {
    type: String,
    enum: ['video', 'simulation', 'flashcard', 'game', 'vr_ar'], // Define valid types
    required: true, // Type is required
  },
  videoLink: {
    type: String,
    required: function() { return this.type === 'video'; }, // Required if type is video
  },
  thumbnail: {
    type: String, // Path to the thumbnail image
    required: true, // Thumbnail is required
  },
  file: {
    type: String, // Can be used for any file uploads (optional, if any)
    default: null, // Defaults to null if not used
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to current date/time
  }
});

// Check if the model is already defined to prevent overwriting
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

module.exports = Content;