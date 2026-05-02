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
const acceptSwapOrder = async (req, res) => {
  try {
    const { id } = req.params; // URL se Swap ka ID milega
    const { artisanId } = req.body; // Frontend se Artisan ka ID aayega

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { 
        status: 'accepted', 
        artisanAssigned: artisanId 
      },
      { new: true } // Updated data return karega
    );

    if (!updatedSwap) {
      return res.status(404).json({ message: 'Swap order not found' });
    }

    res.status(200).json({ message: 'Order accepted successfully!', swap: updatedSwap });
  } catch (error) {
    console.error("❌ Error accepting swap:", error);
    res.status(500).json({ message: 'Failed to accept order' });
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
const getSwapHistory = async (req, res) => {
  try {
    const { userId } = req.query; 
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID required' });
    }

    // $or logic: Ya toh maine upload kiya ho (User), ya maine accept kiya ho (Artisan)
    const history = await Swap.find({ 
      $or: [{ user: userId }, { artisanAssigned: userId }]
    })
    .sort({ createdAt: -1 }) // Latest pehle
    .populate('artisanAssigned', 'name')
    .populate('user', 'name'); 

    res.status(200).json(history);
  } catch (error) {
    console.error("❌ Error fetching swap history:", error);
    res.status(500).json({ message: 'Failed to fetch history' });
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

// module.exports ko update karna mat bhoolna:
module.exports = { 
  getFeaturedSwaps, 
  getPendingSwaps, 
  acceptSwapOrder, 
  getMyActiveSwaps, 
  getSwapHistory,
  completeSwapOrder // 👈 Yeh Naya Add Kiya
};





