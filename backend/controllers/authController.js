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
  console.log('Incoming request body:', req.body); // Log the incoming body for debugging
  console.log('Uploaded file:', req.file); // Log the uploaded file for debugging

  const { username, password, role, grade } = req.body;
  const profilePicture = req.file ? req.file.path : null; // Safely get the file path or assign null

  // Check if password exists before calling .includes
  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  try {
    // Automatically set role to "admin" if the password contains "admin"
    let userRole = role;
    if (password.includes('admin') && userRole !== 'teacher' && userRole !== 'student') {
      userRole = 'admin'; // Set role to admin if password contains 'admin'
    }

    // Validate role (Only 'student', 'teacher', or 'admin' if password condition met)
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(userRole)) {
      return res.status(400).json({ message: 'Invalid role. Allowed roles: student, teacher, admin.' });
    }

    // Ensure grade is provided for students
    if (userRole === 'student' && !grade) {
      return res.status(400).json({ message: 'Grade is required for students.' });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object with profile picture if uploaded
    const newUser = new User({
      username,
      password: hashedPassword,
      role: userRole, // Ensure role is assigned correctly
      grade,
      profilePicture, // Save the profile picture path
    });

    await newUser.save();

    // Create a JWT token
    const token = jwt.sign(
      { username, role: userRole, grade },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Send the response with user info and token
    res.status(201).json({
      user: { username, role: userRole, grade, profilePicture: newUser.profilePicture },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user. Please try again.' });
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
      { username, role: user.role, grade: user.grade },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      user: { username, role: user.role, grade: user.grade, profilePicture: user.profilePicture },
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
