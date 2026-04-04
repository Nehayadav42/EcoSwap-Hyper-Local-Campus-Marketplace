const mongoose = require('mongoose');

/**
 * `test.items` — flexible schema so existing teammate documents still load; new listings use these fields.
 */
const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    condition: { type: String, default: 'Good' },
    isNegotiable: { type: Boolean, default: true },
    description: { type: String, default: '' },
    sellerEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, default: '' }
  },
  { timestamps: true, collection: 'items', strict: false }
);

module.exports = mongoose.models.Item || mongoose.model('Item', itemSchema);
