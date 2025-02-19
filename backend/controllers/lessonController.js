import Lesson from "../models/studentModel.js";

export const getLessons = async (req, res) => {
  try {
    console.log("Fetching lessons from DB...");
    const lessons = await Lesson.find();
    console.log("Lessons found:", lessons); // ✅ Log data from DB

    res.status(200).json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

