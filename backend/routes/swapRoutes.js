const express = require('express');
const router = express.Router();
const { getFeaturedSwaps, getPendingSwaps, acceptSwapOrder } = require('../controllers/swapController');

// Existing Landing Page Route
router.get('/featured', getFeaturedSwaps);

// Naye Artisan Routes
router.get('/pending', getPendingSwaps);
router.put('/:id/accept', acceptSwapOrder);

module.exports = router;