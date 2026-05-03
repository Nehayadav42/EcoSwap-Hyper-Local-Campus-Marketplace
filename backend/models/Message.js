const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  swapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Swap', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);