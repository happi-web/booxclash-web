import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Child from "../models/Child.js"; // ✅ Import using ESM

dotenv.config(); // Load environment variables

// Get all children
export const getAllChildren = async (req, res) => {
  try {
    const children = await Child.find();
    res.status(200).json({ children });
  } catch (error) {
    console.error("Error fetching children:", error);
    res.status(500).json({ message: "Error fetching children" });
  }
};

// Register a new child
export const registerChild = async (req, res) => {
  const { username, grade, years, password } = req.body;
  const subjects = Array.isArray(req.body.subjects) ? req.body.subjects : JSON.parse(req.body.subjects);
  const profilePicture = req.file ? `uploads/${req.file.filename}` : null;

  try {
    // Check if a child with the same name and grade already exists
    const existingChild = await Child.findOne({ username, grade });
    if (existingChild) {
      return res.status(400).json({ message: "A child with the same name and grade is already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newChild = new Child({
      username,
      grade,
      years,
      subjects,
      password: hashedPassword,
      profilePicture,
      role: "student",
    });

    await newChild.save();

    const children = await Child.find();
    res.status(201).json({ message: "Child registered successfully", child: newChild, children });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registering child" });
  }
};

export const childLogin = async (req, res) => {
  console.log("🔍 Received child login request:", req.body); // Log request body

  const { username, password } = req.body;

  if (!username || !password) {
      console.log("⚠ Missing username or password");
      return res.status(400).json({ message: "Username and password are required" });
  }

  try {
      console.log("🔍 Searching for child with username:", username);
      const child = await Child.findOne({ username });

      if (!child) {
          console.log("❌ Child not found in database");
          return res.status(404).json({ message: "Child not found" });
      }

      console.log("✅ Child found:", child.username);
      console.log("🔍 Comparing password...");

      const isMatch = await bcrypt.compare(password, child.password);
      if (!isMatch) {
          console.log("❌ Incorrect password for:", username);
          return res.status(401).json({ message: "Invalid credentials" });
      }

      console.log("✅ Password matched! Generating token...");

      // ✅ Use .env secret key
      if (!process.env.SECRET_KEY) {
          console.error("❌ JWT_SECRET is missing in .env!");
          return res.status(500).json({ message: "Server configuration error" });
      }

      // Include more child profile data in the payload
      const token = jwt.sign(
          {
              id: child._id,
              username: child.username,   // Add username
              grade: child.grade,         // Add grade
              years: child.years,         // Add years
              subjects: child.subjects,   // Add subjects
              profilePicture: child.profilePicture, // Add profile picture
              role: child.role            // Add role
          },
          process.env.SECRET_KEY,
          { expiresIn: "1h" }
      );

      console.log("✅ Token generated:", token);

      // Send token and user data (username, role, etc.) to the frontend
      res.json({
          token,
          user: {
              username: child.username,
              role: child.role,
              grade: child.grade,
              years: child.years,
              subjects: child.subjects,
              profilePicture: child.profilePicture,
          }
      });
  } catch (error) {
      console.error("❌ Error during login:", error);
      res.status(500).json({ message: "Server error" });
  }
};



