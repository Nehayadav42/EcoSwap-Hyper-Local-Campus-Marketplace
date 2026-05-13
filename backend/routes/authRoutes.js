const express = require('express');
const router = express.Router();
const { registerUser, loginUser, googleAuth, verifyOTP, getAllArtisans } = require('../controllers/authController');

// Routes map karna
router.get('/artisans', getAllArtisans);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.post('/verify-otp', verifyOTP);


module.exports = router;