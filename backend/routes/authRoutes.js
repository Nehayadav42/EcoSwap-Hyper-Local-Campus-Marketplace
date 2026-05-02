const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth, verifyOTP, getAllArtisans } = require('../controllers/authController');

// Routes map karna
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);
router.get('/artisans', getAllArtisans);

module.exports = router;