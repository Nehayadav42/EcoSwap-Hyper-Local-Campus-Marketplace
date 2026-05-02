const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteImage: {
    type: String, // Cloudinary ya local URL jahan image save hogi
    required: true
  },
  detectedMaterial: {
    type: String, // AI batayega (e.g., "Denim", "Glass Bottle")
  },
  suggestedProducts: [{
    title: String,
    description: String,
    estimatedEcoScore: Number
  }],
  status: {
    type: String,
    enum: ['pending_artisan', 'accepted', 'upcycling', 'delivered'],
    default: 'pending_artisan'
  },

  status: {
    type: String,
    enum: ['pending_artisan', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending_artisan'
  },
  // 👇 NAYA FIELD ADD KARO
  feedback: {
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },
    createdAt: { type: Date, default: Date.now }
  }, 
  
  artisanAssigned: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Swap', swapSchema);