import { Router } from 'express';
const router = Router();
import { signup, login, upload } from '../controllers/authController.js';

router.post('/signup', upload.single('profilePicture'), signup);
router.post('/login', login);

export default router;
