const express = require('express');
const router = express.Router();
const { signup, login, upload } = require('../controllers/authController');

router.post('/signup', upload.single('profilePicture'), signup);
router.post('/login', login);

module.exports = router;
