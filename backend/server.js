const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

const app = express();
const PORT = 4000;

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    profilePicture: { type: String }, // Optional field for profile picture
    grade: { type: String, required: function() { return this.role === 'student'; } } // Only required if role is student
  });
  

const User = mongoose.model('User', userSchema);

app.use(express.json());
app.use(cors());


const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  audience: { type: String, required: true },
  tags: { type: [String] },
  embedLink: { type: String }, // For video, simulation, AR/VR
  filePath: { type: String },  // For flashcard files
  createdAt: { type: Date, default: Date.now }
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;

// Middleware to authenticate user with token
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired. Please log in again.' });
  }
};

// Signup Route
app.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const validRoles = ['student', 'teacher', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Allowed roles: student, teacher, admin.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign({ username, role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.status(201).json({ user: { username, role }, token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user. Please try again.' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
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

    const token = jwt.sign({ username, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ user: { username, role: user.role }, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in. Please try again.' });
  }
});


// Fetch User Profile Route
app.get('/profile', authenticate, async (req, res) => {
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
});

// Update Profile Picture Route
app.put('/profile/picture', authenticate, async (req, res) => {
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
});


// Fetch all users (For Admin)
app.get('/users', authenticate, async (req, res) => {
  try {
    // Only admin should access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});


// Delete User (For Admin)
app.delete('/users/:id', authenticate, async (req, res) => {
  try {
    // Only admin should access this route
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user.' });
  }
});


app.post('/users', authenticate, async (req, res) => {
  const { username, password, role, grade } = req.body;

  try {
    // Only admin can add users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Allowed roles: student, teacher, admin.' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      role,
      grade: role === 'student' ? grade : undefined // Only assign grade if role is student
    });

    await newUser.save();

    res.status(201).json({ user: { username: newUser.username, role: newUser.role, grade: newUser.grade } });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ message: 'Error creating user. Please try again.' });
  }
});


router.post("/api/upload-content", upload.single("file"), async (req, res) => {
  try {
    const { title, description, type, audience, tags, embedLink } = req.body;
    const file = req.file;

    // Create a new content document
    const newContent = new Content({
      title,
      description,
      type,
      audience,
      tags: tags ? tags.split(",") : [],
      embedLink: type !== "flashcard" ? embedLink : null,
      filePath: type === "flashcard" ? file.path : null
    });

    // Save to database
    await newContent.save();

    res.status(200).json({ message: "Content uploaded successfully!", content: newContent });
  } catch (err) {
    console.error("Error uploading content:", err);
    res.status(500).json({ message: "Server error occurred" });
  }
});

router.get("/api/content", async (req, res) => {
  try {
    const content = await Content.find();
    res.json(content);
  } catch (err) {
    console.error("Error fetching content:", err);
    res.status(500).json({ message: "Error fetching content." });
  }
});

router.put("/api/content/:id", async (req, res) => {
  try {
    const { title, description, type, audience, tags, embedLink } = req.body;

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        type,
        audience,
        tags: tags ? tags.split(",") : [],
        embedLink,
      },
      { new: true } // Return the updated document
    );

    if (!updatedContent) {
      return res.status(404).json({ message: "Content not found." });
    }

    res.json({ message: "Content updated successfully.", content: updatedContent });
  } catch (err) {
    console.error("Error updating content:", err);
    res.status(500).json({ message: "Error updating content." });
  }
});


router.delete("/api/content/:id", async (req, res) => {
  try {
    const deletedContent = await Content.findByIdAndDelete(req.params.id);

    if (!deletedContent) {
      return res.status(404).json({ message: "Content not found." });
    }

    res.json({ message: "Content deleted successfully." });
  } catch (err) {
    console.error("Error deleting content:", err);
    res.status(500).json({ message: "Error deleting content." });
  }
});

app.use(express.json());
app.use(router); // Mount router
// Start the Server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
