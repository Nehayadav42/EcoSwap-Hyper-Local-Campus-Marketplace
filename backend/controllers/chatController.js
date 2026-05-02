const Message = require('../models/Message');

// @route   GET /api/chats/:swapId
// @desc    Get all messages for a specific swap order
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ swapId: req.params.swapId }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

// @route   POST /api/chats
// @desc    Send a new message
const sendMessage = async (req, res) => {
  try {
    const { swapId, senderId, text } = req.body;
    const newMessage = await Message.create({ swapId, senderId, text });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message' });
  }
};

module.exports = { getMessages, sendMessage };