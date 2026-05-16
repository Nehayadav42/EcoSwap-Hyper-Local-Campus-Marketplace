const express = require('express');
const router = express.Router();
const { 
  getFeaturedSwaps, 
  getPendingSwaps, 
  acceptSwapOrder, 
  updateSwapStatus, 
  getMyActiveSwaps, 
  getSwapHistory, 
  completeSwapOrder, 
  createSwap, 
  submitFeedback, 
  confirmAdvancePayment, 
  createInquirySwap
} = require('../controllers/swapController');

// GET Routes
router.get('/featured', getFeaturedSwaps);
router.get('/my-active', getMyActiveSwaps);
router.get('/pending', getPendingSwaps);
router.get('/history', getSwapHistory);

// POST Routes
router.post('/inquiry', createInquirySwap);
router.post('/', createSwap);

// PUT Routes
router.put('/:id/status', updateSwapStatus);
router.put('/:id/accept', acceptSwapOrder);
router.put('/:id/complete', completeSwapOrder);
router.put('/:id/feedback', submitFeedback);
router.put('/:id/advance-paid', confirmAdvancePayment);

module.exports = router;