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

module.exports = { getFeaturedSwaps, getPendingSwaps, acceptSwapOrder };