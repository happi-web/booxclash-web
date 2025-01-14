const express = require('express');
const multer = require('multer');
const path = require('path');
const contentController = require('../controllers/studentContentController'); // Import controller functions
const jwt = require('jsonwebtoken');
const User = require('../models/studentModel'); // Import the User model

const router = express.Router();

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filenames
  },
});

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/zip'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: JPEG, PNG, MP4, ZIP.'));
  }
};

const upload = multer({ storage, fileFilter }); // Multer upload middleware with file filter

// Serve static files from the "uploads" folder
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Route to upload content
router.post('/upload-content', upload.fields([{ name: 'thumbnail' }, { name: 'file' }]), contentController.uploadContent);

// Route to get all content
router.get('/content', contentController.getContent);

// Middleware to verify JWT token and extract user info
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  try {
    // Verify and decode token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Route to get the user's profile data
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Fetch user from the database using the username from the JWT token
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Return user profile info (username, role, grade)
    res.json({
      username: user.username,
      role: user.role,
      grade: user.grade || null, // Grade might be null for non-students
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile data.' });
  }
});

module.exports = router;
