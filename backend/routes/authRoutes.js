const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth } = require('../controllers/authController');

// Routes map karna
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);

module.exports = router;