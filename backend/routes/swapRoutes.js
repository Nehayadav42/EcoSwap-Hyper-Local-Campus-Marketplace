const express = require('express');
const router = express.Router();
const { getFeaturedSwaps, getPendingSwaps, acceptSwapOrder, getMyActiveSwaps, getSwapHistory, completeSwapOrder} = require('../controllers/swapController');

// Existing Landing Page Route
router.get('/featured', getFeaturedSwaps);
router.get('/my-active', getMyActiveSwaps);
// Naye Artisan Routes
router.get('/pending', getPendingSwaps);
router.get('/history', getSwapHistory);
router.put('/:id/accept', acceptSwapOrder);
router.put('/:id/complete', completeSwapOrder);

module.exports = router;