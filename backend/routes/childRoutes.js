import { Router } from "express";
import { extname, join } from 'path';
import express from 'express';
import multer, { diskStorage } from 'multer';
import { getAllChildren, registerChild, childLogin } from "../controllers/childController.js";

const router = Router();
import { fileURLToPath } from 'url';  // Import fileURLToPath from 'url' module
import { dirname } from 'path';  // Import dirname from 'path' module

// Create __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);  // Get current file's URL
const __dirname = dirname(__filename);  // Resolve the directory name from the file path

// Set up multer storage configuration
const storage = diskStorage({
    destination: (req, file, cb) => {
      console.log("Saving file to uploads/"); // Check if this is logged
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      console.log("Saving file as:", Date.now() + extname(file.originalname)); // Log the file name
      cb(null, Date.now() + extname(file.originalname));
    },
  });
  

// File type validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/zip'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: JPEG, PNG, MP4, ZIP.'));
  }
};

const upload = multer({ storage, fileFilter }); // Multer upload middleware with file filter

// Serve static files from the "uploads" folder
router.use('/uploads', express.static(join(__dirname, '../uploads')));  // Fixed the static file serving syntax

// Route to get all children
router.get("/", getAllChildren);
router.post("/child-login", childLogin);

// Route to register a new child
router.post("/register", upload.single('profilePicture'), registerChild); 

export default router;
