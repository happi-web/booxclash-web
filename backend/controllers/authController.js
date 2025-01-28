const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer'); // Import multer for file uploads
const User = require('../models/userModel');

// Set up multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify folder to save the images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  },
});

const upload = multer({ storage: storage }); // Create multer instance with storage options

// Handle signup
const signup = async (req, res) => {
  const { username, password, role, grade, country } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  try {
    // Check if password contains "admin"
    let userRole = password.includes('admin') ? 'admin' : role;

    // Validate role
    if (!['student', 'teacher', 'admin'].includes(userRole)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    // Grade is required for students
    if (userRole === 'student' && !grade) {
      return res.status(400).json({ message: 'Grade is required for students.' });
    }

    // Check for existing username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role: userRole,
      grade: userRole === 'student' ? grade : undefined,
      country,
      profilePicture,
    });

    await newUser.save();

    const token = jwt.sign(
      { username, role: userRole },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      user: { username, role: userRole, grade, country, profilePicture: newUser.profilePicture },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user.' });
  }
};


// Handle login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { username, role: user.role, grade: user.grade, country: user.country },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      user: { username, role: user.role, grade: user.grade, country: user.country, profilePicture: user.profilePicture },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in. Please try again.' });
  }
};

// Export the multer upload middleware along with the signup and login functions
module.exports = {
  signup,
  login,
  upload, // Export the multer instance to use in the routes
};
