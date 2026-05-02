const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  swapId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Swap', 
    required: true 
  },
  senderId: { 
    type: String, // Hum ID ko string ki tarah save kar rahe hain simple rakhne ke liye
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  }
}, { timestamps: true }); // timestamps true karne se createdAt time apne aap save ho jayega

module.exports = mongoose.model('Message', messageSchema);