const express = require('express');
const {getUsers, getProfile, updateProfilePicture } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile/picture', authenticate, updateProfilePicture);

router.get('/users', authenticate, getUsers);

module.exports = router;
