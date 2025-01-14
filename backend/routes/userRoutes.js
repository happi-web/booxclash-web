const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getUsers, getProfile, updateProfilePicture } = require('../controllers/userController'); // Import the controller
const authenticate = require('../middlewares/authMiddleware');
const User = require('../models/userModel'); // Import the User model

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Store files in 'uploads' folder

// Route to update profile picture
router.put('/profile/picture', authenticate, upload.single('profilePicture'), updateProfilePicture);

// Get user profile
router.get('/profile', authenticate, getProfile);

// Route to fetch user profile by username
router.get('/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return all the required fields: username, grade, role, profilePicture
        res.json({
            username: user.username,
            role: user.role,
            grade: user.grade,
            profilePicture: user.profilePicture || '/uploads/default_profile.jpg', // Fallback if no picture
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all users (you can adjust this if needed)
router.get('/users', authenticate, getUsers);
router.get('/content', authenticate, getUsers);

module.exports = router;
