const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

// Fetch all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id username role grade profilePicture');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, password, role, grade } = req.body;

    // Validate required fields
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const newUser = new User({ 
      username, 
      password: hashedPassword, 
      role, 
      grade: role === 'student' ? grade : undefined // Only set grade for students 
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID format (optional)
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find and delete the user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error); // Log the error for debugging
    res.status(500).json({ error: 'Failed to delete user' });
  }
};
