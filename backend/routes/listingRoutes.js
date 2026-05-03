const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// 1. PUBLIC API (Landing Page ke liye)
router.get('/public', async (req, res) => {
    try {
      // Status filter hata kar dekho ki kya saara data aa raha hai
      const listings = await Listing.find({}) 
        .populate('sellerId', 'name')
        .sort({ createdAt: -1 }); 
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// 2. CREATE LISTING API (Jab User ya Artisan kuch bechne aaye)
router.post('/create', async (req, res) => {
  try {
    const newListing = await Listing.create(req.body);
    res.status(201).json(newListing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// routes/listingRoutes.js
router.delete('/:id', async (req, res) => {
    try {
      const listing = await Listing.findByIdAndDelete(req.params.id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json({ message: "Listing deleted successfully" });
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).json({ message: "Failed to delete listing" });
    }
  });
module.exports = router;