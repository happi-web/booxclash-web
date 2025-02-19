import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['parent', 'teacher', 'admin'], required: true },
  grade: { type: String }, // Optional for non-students
  country: { type: String, required: true }, // Added country field (required)
  profilePicture: { type: String, default: null }, // Save file path
});

const User = model('User', userSchema);

export default User;
