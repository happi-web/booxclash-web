const Content = require('../models/studentModel');  // Import the Content model

// Controller function to upload content
const uploadContent = async (req, res) => {
  try {
    const { title, type, videoLink } = req.body;
    const thumbnail = req.files["thumbnail"] ? `/uploads/${req.files["thumbnail"][0].filename}` : null;
    const file = req.files["file"] ? `/uploads/${req.files["file"][0].filename}` : null;

    const newContent = new Content({
      title,
      type,
      videoLink,
      thumbnail,
      file,
    });

    await newContent.save();  // Save to the database
    res.status(200).json(newContent);  // Return the saved content as response
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading content.");
  }
};

// Controller function to get all content
const getContent = async (req, res) => {
  try {
    const contents = await Content.find();  // Fetch all content from the database
    res.status(200).json(contents);  // Return the content as response
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching content.");
  }
};

module.exports = {
  uploadContent,
  getContent,
};
