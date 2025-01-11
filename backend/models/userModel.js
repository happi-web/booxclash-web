const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], required: true },
  grade: { type: String }, // Optional for non-students
  profilePicture: { type: String, default: null }, // Save file path
});

const User = mongoose.model('User', userSchema);

module.exports = User;
