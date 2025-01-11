const express = require('express');
const contentController = require('../controllers/contentController');
const router = express.Router();

// Ensure this route is set up to handle GET requests for content by type
router.get('/content/:type', contentController.getContentByType);

module.exports = router;
