const Content = require('../models/studentModel'); // Import the Content model

// Controller function to upload content
const uploadContent = async (req, res) => {
  try {
    const { title, type, videoLink, link } = req.body;  // Get both videoLink and general link
    const thumbnail = req.files["thumbnail"] ? `/uploads/${req.files["thumbnail"][0].filename}` : null;
    const file = req.files["file"] ? `/uploads/${req.files["file"][0].filename}` : null;

    // Determine if the content is video, simulation, game, or VR/AR
    let videoLinkSaved = null;
    let generalLinkSaved = null;

    if (type === "video" && videoLink) {
      videoLinkSaved = videoLink;  // Save the provided video link
    } else if (type === "simulation" || type === "game" || type === "vr_ar") {
      generalLinkSaved = link;  // Save the general link for simulation, game, or VR/AR
    }

    const newContent = new Content({
      title,
      type,
      videoLink: videoLinkSaved,  // Save video link if it's video content
      link: generalLinkSaved,     // Save general link for simulation, game, or VR/AR
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
    const contents = await Content.find(); // Fetch all content from the database
    res.status(200).json(contents); // Return the content as response
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Error fetching content.' });
  }
};

module.exports = {
  uploadContent,
  getContent,
};
