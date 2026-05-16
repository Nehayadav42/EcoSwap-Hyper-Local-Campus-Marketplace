const Swap = require('../models/Swap');
const User = require('../models/User'); 
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

const acceptSwapOrder = async (req, res) => {
  try {
    const { artisanId, timeline, makingCost } = req.body; 
    const { id } = req.params;

    const distanceKm = (Math.random() * (8 - 1) + 1).toFixed(1); 
    const deliveryFee = Math.round(distanceKm * 12); 
    
    const basePrice = Number(makingCost) || 200; 
    const platformFee = Math.round(basePrice * 0.05); 
    const totalAmount = basePrice + deliveryFee + platformFee;
    const advanceAmount = Math.round(totalAmount * 0.20); 

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { 
        artisanAssigned: artisanId, 
        status: 'pending_advance',
        estimatedTimeline: timeline,
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
      { returnDocument: 'after' } 
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

const createSwap = async (req, res) => {
  try {
    const { userId, wasteImage, detectedMaterial, selectedProduct } = req.body;
    
    const imagePrompt = `professional product photography of ${selectedProduct.title}, ${selectedProduct.description}, high quality, highly detailed, white background, studio lighting`;
    
    let finalImageUrl = `https://placehold.co/400x400/dcfce7/166534?font=Montserrat&text=${encodeURIComponent(selectedProduct.title)}`;

    try {
      const generatedImageUrl = await generateImageWithHF(imagePrompt);
      if (generatedImageUrl) {
         finalImageUrl = generatedImageUrl;
      }
    } catch (hfError) {
      console.error("❌ HF Failed, Using Fallback Image:", hfError.message);
    }

    const finalSelectedProduct = {
      ...selectedProduct,
      generatedImage: finalImageUrl 
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

const submitFeedback = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const { id } = req.params; 

    const swap = await Swap.findByIdAndUpdate(
      id,
      { feedback: { rating, review } },
      { returnDocument: 'after' }
    ).populate('artisanAssigned');

    if (!swap) return res.status(404).json({ message: "Order not found" });

    const artisan = await User.findById(swap.artisanAssigned._id);
    
    const oldTotalReviews = artisan.totalReviews || 0;
    const oldRating = artisan.rating || 0;
    
    const newTotalReviews = oldTotalReviews + 1;
    const newAverageRating = ((oldRating * oldTotalReviews) + Number(rating)) / newTotalReviews;

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

    const updateQuery = { status: status };
    if (artisanId) updateQuery.artisanAssigned = artisanId;

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      updateQuery,
      { returnDocument: 'after' } 
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

const confirmAdvancePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentId } = req.body;

    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 48);

    const updatedSwap = await Swap.findByIdAndUpdate(
      id,
      { 
        status: 'ready_for_pickup', 
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

// 🔥 BULLETPROOF INQUIRY CREATION 🔥
const createInquirySwap = async (req, res) => {
  try {
    const { userId, artisanId, product } = req.body;

    // Adding Fallbacks so Mongoose doesn't crash on missing data
    const safeTitle = product?.title || 'Custom Product';
    const safeImage = product?.imageUrl || `https://placehold.co/400x400/dcfce7/166534?font=Montserrat&text=${encodeURIComponent(safeTitle)}`;

    const newInquiry = await Swap.create({
      user: userId,
      artisanAssigned: artisanId,
      wasteImage: safeImage, 
      detectedMaterial: "Product Inquiry",
      selectedProduct: {
        title: `Inquiry: ${safeTitle}`,
        description: product?.description || "Inquiring about this item",
        imageUrl: safeImage,
        generatedImage: safeImage
      },
      status: 'accepted' // Keep it accepted so it shows up in Active Chats immediately
    });

    res.status(201).json(newInquiry);
  } catch (error) {
    console.error("❌ Inquiry Error:", error);
    res.status(500).json({ message: error.message });
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
  confirmAdvancePayment,
  createInquirySwap,
};