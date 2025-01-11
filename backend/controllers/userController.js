const User = require('../models/userModel');

const getUsers = async (req, res) => {
  try {
    const users = await User.find();  // Fetching all users
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
};

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

const updateProfilePicture = async (req, res) => {
  const { profilePicture } = req.body;

  try {
    if (!profilePicture) {
      return res.status(400).json({ message: 'No profile picture provided.' });
    }

    const user = await User.findOneAndUpdate(
      { username: req.user.username },
      { profilePicture },
      { new: true }
    ).select('username role profilePicture');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'Profile picture updated successfully.', user });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture.' });
  }
};

module.exports = { getUsers, getProfile, updateProfilePicture };
