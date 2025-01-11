const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');  // Import multer for file uploads
const User = require('../models/userModel');  // Import the User model

const router = express.Router();

// Set up multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Specify folder to save the images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Use a unique filename
  }
});

const upload = multer({ storage: storage });  // Create multer instance with storage options

// Middleware to verify JWT token and extract user info
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;  // Attach user data to the request object
    next();  // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Route to get the user's profile data
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return user profile info (username, role, grade, profilePicture)
    res.json({
      username: user.username,
      role: user.role,
      profilePicture: user.profilePicture || null,
      grade: user.role === 'student' ? user.grade : null,  // Include grade only for students
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile data.' });
  }
});

// Route to update profile picture
router.put('/profile/picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Update the user's profile with the new profile picture path
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.profilePicture = req.file.path;  // Save the image path in the database
    await user.save();

    res.json({ message: 'Profile picture updated successfully!', user: { username: user.username, role: user.role, profilePicture: user.profilePicture } });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ message: 'Error uploading profile picture.' });
  }
});

module.exports = router;
