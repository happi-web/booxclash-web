const mongoose = require('mongoose');

// Define the Video schema
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  videoLink: { type: String, required: true },
});

// Create a model from the schema
const Video = mongoose.model('Video', videoSchema);

module.exports = Video;
