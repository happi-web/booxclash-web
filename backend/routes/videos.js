const express = require('express');
const router = express.Router();
const Video = require('../models/Video'); // Assuming Video model is located here

// GET all videos
router.get('/contents/videos', async (req, res) => {
  try {
    const videos = await Video.find();
    res.status(200).json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
