const Content = require("../models/studentModel"); // Import the Content model

// Controller function to upload content
const uploadContent = async (req, res) => {
  try {
    const { title, type, link, component } = req.body; // Extract fields from request body
    const thumbnail = req.files?.thumbnail
      ? `/uploads/${req.files.thumbnail[0].filename}`
      : null;
    const file = req.files?.file
      ? `/uploads/${req.files.file[0].filename}`
      : null;

    // Create new content object based on type
    const newContent = new Content({
      title,
      type,
      link, // Save the provided link for video, simulation, etc.
      thumbnail, // Only for game and vr_ar
      component, // Only for game
    });

    // Save content to database
    const savedContent = await newContent.save();
    res.status(200).json(savedContent); // Return saved content
  } catch (error) {
    console.error("Error uploading content:", error);
    res.status(500).send("Error uploading content.");
  }
};

// Controller function to get all content
const getContent = async (req, res) => {
  try {
    const contents = await Content.find(); // Fetch all content from the database
    res.status(200).json(contents); // Return the content as response
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ message: "Error fetching content." });
  }
};

module.exports = {
  uploadContent,
  getContent,
};
