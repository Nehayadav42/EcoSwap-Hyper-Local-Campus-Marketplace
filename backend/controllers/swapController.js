const Swap = require('../models/Swap');
const { generateImageWithHF } = require('../utils/aiHelpers');

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

const getPendingSwaps = async (req, res) => {
  try {
    const pendingSwaps = await Swap.find({ status: 'pending_artisan' })
      .sort({ createdAt: -1 })
      .populate('user', 'name'); 
    res.status(200).json(pendingSwaps);
  } catch (error) {
    console.error("❌ Error fetching pending swaps:", error);
    res.status(500).json({ message: 'Failed to fetch pending orders' });
  }
};

// @route   PUT /api/swaps/:id/accept
const acceptSwapOrder = async (req, res) => {
  try {
    const { artisanId, timeline, makingCost } = req.body; 
    const { id } = req.params;

    // 🔥 HACKATHON HACK: AI Delivery Calculator Simulation
    const distanceKm = (Math.random() * (8 - 1) + 1).toFixed(1); // 1 to 8 km random distance
    const deliveryFee = Math.round(distanceKm * 12); // ₹12 per km
    
    const basePrice = Number(makingCost) || 200; // Default 200 if not provided
    const platformFee = Math.round(basePrice * 0.05); // 5% platform fee
    const totalAmount = basePrice + deliveryFee + platformFee;
    const advanceAmount = Math.round(totalAmount * 0.20); // 20% advance payment

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { 
        artisanAssigned: artisanId, 
        // Status abhi seedha 'accepted' nahi, pehle advance mangenge
        status: 'pending_advance',
        estimatedTimeline: timeline,
        // Naya pricing data save kar rahe hain
        pricing: {
          basePrice,
          deliveryFee,
          platformFee,
          totalAmount,
          advanceAmount,
          distanceKm
        }
      },
      { returnDocument: 'after' } 
    );

    res.status(200).json(updatedSwap);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyActiveSwaps = async (req, res) => {
  try {
    const { userId } = req.query; 
    if (!userId) return res.status(400).json({ message: 'User ID required' });

    const activeSwaps = await Swap.find({ 
      $or: [{ user: userId }, { artisanAssigned: userId }],
      status: { $in: ['pending_artisan', 'accepted', 'in_progress', 'picked_up'] } 
    })
    .sort({ updatedAt: -1 })
    .populate('artisanAssigned', 'name')
    .populate('user', 'name'); 

    res.status(200).json(activeSwaps);
  } catch (error) {
    console.error("❌ Error fetching active swaps:", error);
    res.status(500).json({ message: 'Failed to fetch active swaps' });
  }
};

const getSwapHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    let filter = {}; 

    if (userId) {
      filter = {
        $or: [
          { userId: userId },             
          { user: userId },               
          { artisanAssigned: userId }     
        ]
      };
    } else {
      filter = { status: { $in: ['pending', 'pending_artisan'] } }; 
    }

    const swaps = await Swap.find(filter).sort({ createdAt: -1 }).populate('artisanAssigned', 'name');
    res.status(200).json(swaps);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const completeSwapOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { returnDocument: 'after' } // 🔥 Fixed Mongoose Warning
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

// 🔥 BULLETPROOF CREATE SWAP 🔥
const createSwap = async (req, res) => {
  try {
    const { userId, wasteImage, detectedMaterial, selectedProduct } = req.body;
    
    const imagePrompt = `professional product photography of ${selectedProduct.title}, ${selectedProduct.description}, high quality, highly detailed, white background, studio lighting`;
    
    // Default Placeholder Image in case HF fails
    let finalImageUrl = `https://placehold.co/400x400/dcfce7/166534?font=Montserrat&text=${encodeURIComponent(selectedProduct.title)}`;

    try {
      // HF API Call ko try catch mein wrap kar diya!
      const generatedImageUrl = await generateImageWithHF(imagePrompt);
      if (generatedImageUrl) {
         finalImageUrl = generatedImageUrl;
      }
    } catch (hfError) {
      console.error("❌ HF Failed, Using Fallback Image:", hfError.message);
    }

    const finalSelectedProduct = {
      ...selectedProduct,
      generatedImage: finalImageUrl // Ab image 100% jaayegi database mein
    };

    const newSwap = await Swap.create({
      user: userId,
      wasteImage,
      detectedMaterial,
      suggestedProducts: [finalSelectedProduct], 
      status: 'pending_artisan'
    });
    
    res.status(201).json(newSwap);
  } catch (error) {
    console.error("❌ Error creating swap:", error);
    res.status(500).json({ message: error.message });
  }
};

const User = require('../models/User'); // Artisan ka data update karne ke liye

const submitFeedback = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { id } = req.params; // Order ID

    // 1. Order ko update karo feedback ke saath
    const swap = await Swap.findByIdAndUpdate(
      id,
      { feedback: { rating, review } },
      { returnDocument: 'after' }
    ).populate('artisanAssigned');

    if (!swap) return res.status(404).json({ message: "Order not found" });

    const artisan = await User.findById(swap.artisanAssigned._id);
    
    // 2. Artisan ki overall ranking update karne ka logic
    const oldTotalReviews = artisan.totalReviews || 0;
    const oldRating = artisan.rating || 0;
    
    const newTotalReviews = oldTotalReviews + 1;
    const newAverageRating = ((oldRating * oldTotalReviews) + Number(rating)) / newTotalReviews;

    // 3. Artisan model update karo
    await User.findByIdAndUpdate(swap.artisanAssigned._id, {
      rating: newAverageRating.toFixed(1),
      totalReviews: newTotalReviews
    });

    res.status(200).json({ message: 'Rating synced with Artisan Profile!', swap });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit rating' });
  }
};

const updateSwapStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status, artisanId } = req.body; 

    // Find Query update ki taaki artisanId sirf tab assign ho jab bheja jaye
    const updateQuery = { status: status };
    if (artisanId) updateQuery.artisanAssigned = artisanId;

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      updateQuery,
      { returnDocument: 'after' } // 🔥 Fixed Mongoose Warning
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

// @route   PUT /api/swaps/:id/advance-paid
const confirmAdvancePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId } = req.body;

    // 48 Hours ka deadline set karo
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 48);

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { 
        status: 'ready_for_pickup', // Ab artisan ja sakta hai
        pickupDeadline: deadline,
        advancePaymentId: paymentId
      },
      { returnDocument: 'after' } 
    );

    res.status(200).json({ message: "Advance Paid! Artisan notified.", swap: updatedSwap });
  } catch (error) {
    console.error("Error confirming advance:", error);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};

module.exports = { 
  getFeaturedSwaps, 
  getPendingSwaps, 
  acceptSwapOrder, 
  getMyActiveSwaps, 
  getSwapHistory, 
  completeSwapOrder, 
  createSwap, 
  submitFeedback, 
  updateSwapStatus,
  confirmAdvancePayment
};