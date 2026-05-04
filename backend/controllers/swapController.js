const Swap = require('../models/Swap');

// 1. PUBLIC ROUTE: Landing page ke liye
const getFeaturedSwaps = async (req, res) => {
  try {
    const featuredSwaps = await Swap.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('artisanAssigned', 'name'); 
    res.status(200).json(featuredSwaps);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch featured swaps' });
  }
};

// 2. ARTISAN ROUTE: Sirf pending orders dekhne ke liye
const getPendingSwaps = async (req, res) => {
  try {
    // Sirf wahi swaps lao jinka status 'pending_artisan' hai
    const pendingSwaps = await Swap.find({ status: 'pending_artisan' })
      .sort({ createdAt: -1 })
      .populate('user', 'name'); // Jis user ne upload kiya hai uska naam bhi chahiye
      
    res.status(200).json(pendingSwaps);
  } catch (error) {
    console.error("❌ Error fetching pending swaps:", error);
    res.status(500).json({ message: 'Failed to fetch pending orders' });
  }
};

// 3. ARTISAN ROUTE: Order accept karne ke liye
// @route   PUT /api/swaps/:id/accept
const acceptSwapOrder = async (req, res) => {
  try {
    const { artisanId, timeline } = req.body; // 👈 Timeline receive karenge (e.g., "1 week")
    const { id } = req.params;

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { 
        artisanAssigned: artisanId, 
        status: 'accepted',
        estimatedTimeline: timeline // 👈 Isko save karenge
      },
      { new: true }
    );

    res.status(200).json(updatedSwap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   GET /api/swaps/my-active
// @desc    Get active orders for the logged-in user
// @route   GET /api/swaps/my-active
const getMyActiveSwaps = async (req, res) => {
  try {
    const { userId } = req.query; 
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    // Yahan hum $or use kar rahe hain: 
    // Ya toh upload karne wala yeh user ho, YA FIR order accept karne wala yeh artisan ho!
    const activeSwaps = await Swap.find({ 
      $or: [{ user: userId }, { artisanAssigned: userId }],
      status: { $in: ['pending_artisan', 'accepted', 'in_progress'] } 
    })
    .sort({ updatedAt: -1 })
    .populate('artisanAssigned', 'name')
    .populate('user', 'name'); // 👇 Yeh NAYA add kiya hai taaki artisan ko pata chale kiska kachra hai

    res.status(200).json(activeSwaps);
  } catch (error) {
    console.error("❌ Error fetching active swaps:", error);
    res.status(500).json({ message: 'Failed to fetch active swaps' });
  }
};

// @route   GET /api/swaps/history
// @desc    Get ALL swaps (history) for User or Artisan


// Backend: controllers/swapController.js

 const getSwapHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    let filter = {}; 

    if (userId) {
      // 🔥 Yahan humne backend ko bataya: 
      // "Order lao agar user ne upload kiya ho YA FIR artisan ne accept kiya ho"
      filter = {
        $or: [
          { userId: userId },             // Agar client ne upload kiya
          { user: userId },               // Alternate field for client
          { artisanAssigned: userId }     // 👈 YE NAYI LINE: Agar artisan ne order accept kiya
        ]
      };
    } else {
      // Artisan Dashboard ke liye pending orders
      filter = { status: { $in: ['pending', 'pending_artisan'] } }; 
    }

    const swaps = await Swap.find(filter).sort({ createdAt: -1 });
    res.status(200).json(swaps);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route   PUT /api/swaps/:id/complete
// @desc    Mark an order as completed (By Artisan)
const completeSwapOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { new: true }
    );

    if (!updatedSwap) {
      return res.status(404).json({ message: 'Swap order not found' });
    }

    res.status(200).json({ message: 'Order marked as completed!', swap: updatedSwap });
  } catch (error) {
    console.error("❌ Error completing swap:", error);
    res.status(500).json({ message: 'Failed to complete order' });
  }
};

// @route   POST /api/swaps
// @desc    Create a new swap order after user selection
const createSwap = async (req, res) => {
  try {
    const { userId, wasteImage, detectedMaterial, selectedProduct } = req.body;
    
    const newSwap = await Swap.create({
      user: userId,
      wasteImage,
      detectedMaterial,
      suggestedProducts: [selectedProduct], // Sirf selected wala array mein dalenge
      status: 'pending_artisan'
    });
    
    res.status(201).json(newSwap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/swaps/:id/feedback
// @desc    Submit feedback for a completed swap
const submitFeedback = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { id } = req.params;

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { feedback: { rating, review } },
      { new: true }
    );

    res.status(200).json({ message: 'Feedback submitted successfully', swap: updatedSwap });
  } catch (error) {
    console.error("❌ Error submitting feedback:", error);
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};

// backend/controllers/swapController.js ke andar kahin bhi add kardo

const updateSwapStatus = async (req, res) => {
  try {
    const { id } = req.params; // Order ki ID URL se milegi
    const { status, artisanId } = req.body; // Frontend se 'accepted' aur artisan ki ID aayegi

    // Database mein order dhoondo aur update karo
    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { 
        status: status, 
        artisanAssigned: artisanId // Artisan ko is order se link kar diya
      },
      { new: true } // Naya updated data return karega
    );

    if (!updatedSwap) {
      return res.status(404).json({ message: "Order nahi mila!" });
    }

    res.status(200).json(updatedSwap);
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error status update karne mein" });
  }
};

// module.exports mein isko add karna mat bhoolna:
module.exports = { 
  getFeaturedSwaps, getPendingSwaps, acceptSwapOrder, getMyActiveSwaps, 
  getSwapHistory, completeSwapOrder, createSwap, submitFeedback, updateSwapStatus // 👈 Add this
};







