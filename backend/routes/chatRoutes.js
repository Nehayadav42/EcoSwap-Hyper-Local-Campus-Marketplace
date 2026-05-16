const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, editMessage, deleteMessage} = require('../controllers/chatController');

router.get('/:swapId', getMessages);
router.post('/', sendMessage);
router.put('/:messageId', editMessage);
router.delete('/:messageId', deleteMessage);

module.exports = router;