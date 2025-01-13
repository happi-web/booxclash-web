const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const lessonPlanRoutes = require('./routes/lessonPlanRoutes'); 
const studentUploadRoutes = require('./routes/studentUploadRoutes');
const studentProfileRoutes = require('./routes/studentsProfileRoutes');
const contentRoutes = require('./routes/contentRoutes');
const videosRoute = require('./routes/videos'); 

require('dotenv').config();

// Initialize app
const app = express();
const PORT = 4000;

// Connect to DB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());


// Routes
app.use(authRoutes);
app.use(userRoutes);
app.use(lessonPlanRoutes); 
app.use('/api', studentUploadRoutes); 
app.use('/api', studentProfileRoutes);
app.use('/api', contentRoutes);
app.use('/api', videosRoute);

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
