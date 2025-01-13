const User = require('../models/userModel');
const path = require('path');

// Fetch all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find(); // Fetching all users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

// Update the profile picture
const updateProfilePicture = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  const filename = req.file.filename;
  const imageUrl = `http://localhost:4000/uploads/${filename}`;

  try {
    // Assuming `req.user` contains the logged-in user information
    const user = await User.findByIdAndUpdate(
      req.user._id, 
      { profilePicture: imageUrl }, 
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      message: 'Profile picture updated successfully.',
      user: {
        username: user.username,
        role: user.role,
        grade: user.grade,
        profilePicture: imageUrl, // Return the full URL
      },
    });
  } catch (err) {
    console.error('Error updating profile picture:', err);
    res.status(500).json({ message: 'Error updating profile picture.', error: err.message });
  }
};

// Fetch profile of the logged-in user
const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select('username role profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile.' });
  }
};



module.exports = { getUsers, getProfile, updateProfilePicture };
