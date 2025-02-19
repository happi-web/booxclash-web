import { Router } from 'express';
import { getContentByType } from '../controllers/contentController.js';
const router = Router();

// Ensure this route is set up to handle GET requests for content by type
router.get('/content/:type', getContentByType);

export default router;
