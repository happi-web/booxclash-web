const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  profilePicture: { type: String }, // Optional field for profile picture
  grade: { type: String, required: function() { return this.role === 'student'; } } // Only required if role is student
});

const User = mongoose.model('User', userSchema);

module.exports = User;
