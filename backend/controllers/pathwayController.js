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

export const getNextPathwayBySubject = async (req, res) => {
  try {
    const { subject, currentTitle } = req.params;

    // Find the current pathway
    const currentPathway = await Pathway.findOne({ title: currentTitle, subject });

    if (!currentPathway) {
      return res.status(404).json({ message: "Current pathway not found" });
    }

    // Get the next lesson in the same subject
    const nextPathway = await Pathway.findOne({
      subject,
      _id: { $gt: currentPathway._id }, // Get the next lesson based on order
    }).sort({ _id: 1 });

    if (!nextPathway) {
      return res.status(404).json({ message: "No next lesson available for this subject" });
    }

    res.json(nextPathway);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get a single pathway by pathwayId (fix for string issue)
export const getPathwayBySubject = async (req, res) => {
  try {
    const subject = req.params.subject;
    
    const pathway = await Pathway.findOne({ subject: subject });

    if (!pathway) {
      return res.status(404).json({ message: "Pathway not found" });
    }

    res.json(pathway);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get the next pathway based on the title
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
export const updatePathway = async (req, res) => {
  try {
    const updatedPathway = await Pathway.findOneAndUpdate(
      { pathwayId: req.params.id },  // Changed from findByIdAndUpdate
      req.body,
      { new: true }
    );
    if (!updatedPathway) return res.status(404).json({ message: "Pathway not found" });
    res.json({ message: "Pathway updated successfully", pathway: updatedPathway });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a pathway
export const deletePathway = async (req, res) => {
  try {
    const deletedPathway = await Pathway.findOneAndDelete({ pathwayId: req.params.id }); // Changed from findByIdAndDelete
    if (!deletedPathway) return res.status(404).json({ message: "Pathway not found" });
    res.json({ message: "Pathway deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
