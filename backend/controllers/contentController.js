// controllers/contentController.js
import Content from '../models/contentModel.js';

// Controller to fetch content based on its type
export async function getContentByType(req, res) {
  const { type } = req.params; // Get the content type from the URL (e.g., 'video', 'simulation')

  try {
    // Validate that the content type is valid
    if (!['video', 'simulation', 'flashcard', 'game', 'vr_ar'].includes(type)) {
      return res.status(400).json({ message: 'Invalid content type.' });
    }

    // Fetch content from the database by the type field
    const content = await Content.find({ type });

    // If no content is found, return a 404 response
    if (!content || content.length === 0) {
      return res.status(404).json({ message: 'Content not found for this type.' });
    }

    // Return the content
    res.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    res.status(500).json({ message: 'Error fetching content.', error: error.message });
  }
}
