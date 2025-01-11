const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getUsers, getProfile, updateProfilePicture } = require('../controllers/userController'); // Import the controller
const authenticate = require('../middlewares/authMiddleware');

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Store files in 'uploads' folder

// Route to update profile picture
router.put('/profile/picture', authenticate, upload.single('profilePicture'), updateProfilePicture);

// Get user profile
router.get('/profile', authenticate, getProfile);

// Get all users (you can adjust this if needed)
router.get('/users', authenticate, getUsers);
router.get('/content', authenticate, getUsers);

module.exports = router;
