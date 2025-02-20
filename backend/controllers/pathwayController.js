import Pathway from "../models/Pathway.js";

// Get all pathways
export const getAllPathways = async (req, res) => {
  try {
    const pathways = await Pathway.find();
    res.json(pathways);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single pathway by title
export const getPathwayByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const pathway = await Pathway.findOne({ title });

    if (!pathway) {
      return res.status(404).json({ message: "Pathway not found" });
    }

    res.json(pathway);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a pathway by subject and lessonNumber
export const getPathwayBySubjectAndLesson = async (req, res) => {
  try {
    const { subject, lessonNumber } = req.params;
    const pathway = await Pathway.findOne({ subject, lessonNumber });

    if (!pathway) {
      return res.status(404).json({ message: "Pathway not found for the given subject and lesson number" });
    }

    res.json(pathway);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get the next pathway based on the current lesson number within the subject
export const getNextPathwayBySubjectAndLesson = async (req, res) => {
  try {
    const { subject, lessonNumber } = req.params;

    // Find the current pathway based on subject and lesson number
    const currentPathway = await Pathway.findOne({ subject, lessonNumber });

    if (!currentPathway) {
      return res.status(404).json({ message: "Current pathway not found for this subject and lesson number" });
    }

    // Get the next lesson in the same subject and order by lessonNumber
    const nextPathway = await Pathway.findOne({
      subject,
      lessonNumber: { $gt: currentPathway.lessonNumber },
    }).sort({ lessonNumber: 1 });

    if (!nextPathway) {
      return res.status(404).json({ message: "No next lesson available in this subject" });
    }

    res.json(nextPathway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get the next pathway based on the current title
export const getNextPathway = async (req, res) => {
  try {
    const { title } = req.params;

    // Find the current pathway
    const currentPathway = await Pathway.findOne({ title });

    if (!currentPathway) {
      return res.status(404).json({ message: "Current pathway not found" });
    }

    // Find the next pathway (assuming titles are ordered in the DB)
    const nextPathway = await Pathway.findOne({ _id: { $gt: currentPathway._id } }).sort({ _id: 1 });

    if (!nextPathway) {
      return res.status(404).json({ message: "No next lesson available" });
    }

    res.json(nextPathway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new pathway
export const createPathway = async (req, res) => {
  try {
    const newPathway = new Pathway(req.body);
    await newPathway.save();
    res.status(201).json({ message: "Pathway created successfully", pathway: newPathway });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a pathway
// Update a pathway (including points)
export const updatePathway = async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;  // Expect points in the request body
    
    // Find the pathway by its ID and update the points
    const updatedPathway = await Pathway.findByIdAndUpdate(
      id,  // Use the _id from the request params
      { points }, // Only update the points field (you can update more fields here if needed)
      { new: true }  // Return the updated document
    );
    
    if (!updatedPathway) {
      return res.status(404).json({ message: "Pathway not found" });
    }

    res.json({ message: "Pathway updated successfully", pathway: updatedPathway });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a pathway
export const deletePathway = async (req, res) => {
  try {
    // Use _id for the delete operation
    const deletedPathway = await Pathway.findByIdAndDelete(req.params.id); // Use _id here
    if (!deletedPathway) return res.status(404).json({ message: "Pathway not found" });
    res.json({ message: "Pathway deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
