const express = require('express');
const router = express.Router();
const userManager = require('../controllers/userManager');

// Fetch all users
router.get('/users', userManager.getAllUsers);

// Create a new user
router.post('/users', userManager.createUser);

// Delete a user
router.delete('/users/:id', userManager.deleteUser);

module.exports = router;

