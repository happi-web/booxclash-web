import Child from "../models/Child.js";

// Get a child's profile by username
export const getChildProfile = async (req, res) => {
  try {
    // Use findOne to query by the username
    const child = await Child.findOne({ username: req.params.username });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.json(child);
  } catch (error) {
    console.error("Error fetching child profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export default { getChildProfile };
