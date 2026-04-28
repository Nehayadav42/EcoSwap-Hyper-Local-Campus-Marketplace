const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const Swap = require('../models/Swap');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeWasteImage = async (req, res) => {
  console.log("---- AI ENGINE TRIGGERED ----");
  console.log("Received Body:", req.body);

  const { imageUrl, userId } = req.body;

  if (!imageUrl || !userId) {
    return res.status(400).json({ message: 'Image URL and User ID are required' });
  }

  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const mimeType = imageResponse.headers['content-type'];
    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');

    // 👇 Yahan humne tumhari list se NAYA aur VALID model use kiya hai
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      You are an expert upcycling and recycling AI assistant. Look at this image of waste or discarded material.
      1. Identify the primary material (e.g., Denim, Plastic Bottle, Wood, Glass).
      2. Suggest exactly 3 creative upcycling product ideas that an artisan can make from this.
      3. Assign an estimated Eco-score (in kg of waste saved, between 0.5 to 5.0).
      
      Respond STRICTLY in JSON format without any markdown blocks or extra text. Use this exact structure:
      {
        "detectedMaterial": "Name of material",
        "suggestedProducts": [
          {
            "title": "Product Idea 1",
            "description": "Short description of how it will be made",
            "estimatedEcoScore": 1.5
          }
        ]
      }
    `;

    // Format for latest Gemini models
    const imageParts = [
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType
        }
      }
    ];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiData = JSON.parse(cleanedText);

    const newSwap = await Swap.create({
      user: userId,
      wasteImage: imageUrl,
      detectedMaterial: aiData.detectedMaterial,
      suggestedProducts: aiData.suggestedProducts,
      status: 'pending_artisan'
    });

    console.log("✅ AI Analysis Successful!");
    res.status(201).json({ message: 'Success', swapData: newSwap });

  } catch (error) {
    console.error("❌ AI Error:", error.message);
    res.status(500).json({ message: 'Failed to analyze image with AI' });
  }
};

module.exports = { analyzeWasteImage };