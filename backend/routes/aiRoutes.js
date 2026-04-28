const express = require('express');
const aiRouter = express.Router();
const { analyzeWasteImage } = require('../controllers/aiController');

// Route for AI analysis
aiRouter.post('/analyze', analyzeWasteImage);

module.exports = aiRouter;