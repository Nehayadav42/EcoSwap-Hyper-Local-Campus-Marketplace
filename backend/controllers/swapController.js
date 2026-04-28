const Swap = require('../models/Swap');

// @desc    Create a new swap (after upload)
// @route   POST /api/swaps
// @access  Private
const createSwap = async (req, res) => {
  const { wasteImage, detectedMaterial, suggestedProducts } = req.body;

  if (!wasteImage) {
    return res.status(400).json({ message: 'wasteImage is required' });
  }

  try {
    const swap = await Swap.create({
      user: req.user._id,
      wasteImage,
      detectedMaterial,
      suggestedProducts,
    });

    return res.status(201).json(swap);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's swaps
// @route   GET /api/swaps
// @access  Private
const getMySwaps = async (req, res) => {
  try {
    const swaps = await Swap.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json(swaps);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats for current user
// @route   GET /api/swaps/stats
// @access  Private
const getMySwapStats = async (req, res) => {
  try {
    const total = await Swap.countDocuments({ user: req.user._id });
    const active = await Swap.countDocuments({
      user: req.user._id,
      status: { $in: ['pending_artisan', 'accepted', 'upcycling'] },
    });

    const latestActive = await Swap.findOne({
      user: req.user._id,
      status: { $in: ['pending_artisan', 'accepted', 'upcycling'] },
    }).sort({ updatedAt: -1, createdAt: -1 });

    return res.json({ total, active, latestActive });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createSwap, getMySwaps, getMySwapStats };
