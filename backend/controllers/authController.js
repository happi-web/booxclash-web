import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/userModel.js'; // Updated to use .js for ES module imports
import dotenv from 'dotenv'; // Import dotenv package
dotenv.config(); // Load environment variables

// Set up multer storage options
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify folder to save images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Use a unique filename
  },
});

export const upload = multer({ storage: storage }); // Create multer instance

// Handle signup
export const signup = async (req, res) => {
  const { username, password, role, country, adminSecret } = req.body;
  const profilePicture = req.file ? req.file.path : null;

  try {
    let userRole = role;

    // Only allow "admin" role if the correct secret key is provided
    if (role === 'admin') {
      if (adminSecret !== process.env.VITE_ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret key.' });
      }
    } else if (!['teacher', 'parent'].includes(userRole)) {
      return res.status(400).json({ message: 'Invalid role. Only "teacher" or "parent" allowed.' });
    }

    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      role: userRole,
      country,
      profilePicture,
    });

    await newUser.save();

    const token = jwt.sign(
      { username, role: userRole, country },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      user: { username, role: userRole, country, profilePicture: newUser.profilePicture },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user.' });
  }
};

// Handle login
export const login = async (req, res) => {
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
      { username, role: user.role, country: user.country },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      user: { username, role: user.role, country: user.country, profilePicture: user.profilePicture },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in. Please try again.' });
  }
};
