const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Type define karega ki yeh raw kachra hai ya artisan ka banaya hua product
  listingType: { 
    type: String, 
    enum: ['raw_material', 'finished_good'], 
    required: true 
  },
  
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  stock: { type: Number, default: 1 },  
  // Specific to 'finished_good' (Artisan's products)
  madeFrom: { type: String, default: 'Mixed Recycled Materials' }, // e.g., "Made from 10kg Old Denim"
  ecoScoreSaved: { type: Number, default: 0 },
  
  status: { type: String, enum: ['available', 'sold'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);