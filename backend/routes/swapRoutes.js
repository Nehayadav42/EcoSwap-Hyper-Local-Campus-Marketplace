const express = require('express');
const router = express.Router();
const { getFeaturedSwaps, getPendingSwaps, acceptSwapOrder, getMyActiveSwaps, getSwapHistory, completeSwapOrder, createSwap, submitFeedback} = require('../controllers/swapController');

// Existing Landing Page Route
router.get('/featured', getFeaturedSwaps);
router.get('/my-active', getMyActiveSwaps);
// Naye Artisan Routes
router.get('/pending', getPendingSwaps);
router.get('/history', getSwapHistory);
router.post('/', createSwap);
router.put('/:id/accept', acceptSwapOrder);
router.put('/:id/complete', completeSwapOrder);
router.post('/:id/feedback', submitFeedback);


module.exports = router;