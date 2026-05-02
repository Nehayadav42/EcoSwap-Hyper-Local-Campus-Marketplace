const express = require('express');
const router = express.Router();
const { getFeaturedSwaps, getPendingSwaps, acceptSwapOrder, getMyActiveSwaps } = require('../controllers/swapController');

// Existing Landing Page Route
router.get('/featured', getFeaturedSwaps);
router.get('/my-active', getMyActiveSwaps);
// Naye Artisan Routes
router.get('/pending', getPendingSwaps);
router.put('/:id/accept', acceptSwapOrder);

module.exports = router;