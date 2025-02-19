import { Router } from 'express';
const router = Router();
import { getAllUsers, createUser, deleteUser } from '../controllers/userManager.js';

// Fetch all users
router.get('/users', getAllUsers);

// Create a new user
router.post('/users', createUser);

// Delete a user
router.delete('/users/:id', deleteUser);

export default router;

