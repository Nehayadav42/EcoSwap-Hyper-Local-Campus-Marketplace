const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { createSwap, getMySwaps, getMySwapStats } = require('../controllers/swapController');

router.get('/', protect, getMySwaps);
router.get('/stats', protect, getMySwapStats);
router.post('/', protect, createSwap);

module.exports = router;
