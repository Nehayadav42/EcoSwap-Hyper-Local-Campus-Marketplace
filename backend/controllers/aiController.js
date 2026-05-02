const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const Swap = require('../models/Swap');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeWasteImage = async (req, res) => {
  console.log("---- AI ENGINE TRIGGERED ----");
  const { imageUrl, userId } = req.body;

  if (!imageUrl || !userId) {
    return res.status(400).json({ message: 'Image URL and User ID are required' });
  }

  let aiData = null;

  try {
    console.log("1. Fetching image from Cloudinary...");
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const mimeType = imageResponse.headers['content-type'];
    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');
    console.log("2. Image fetched successfully. Sending to Gemini...");

    // Yahan hum gemini-2.5-flash use kar rahe hain aur usko strict JSON ke liye force kar rahe hain
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" } // 👈 THE MAGIC FIX
    });

    const prompt = `
      Analyze this waste/discarded material image.
      1. Identify the primary material (e.g., Denim, Broken Glass, Plastic Bottle, Scrap Wood).
      2. Suggest EXACTLY 5 creative upcycling product ideas that an artisan could make from this specific material.
      
      Respond ONLY with this JSON structure:
      {
        "detectedMaterial": "Specific material name",
        "suggestedProducts": [
          {
            "title": "Product Idea 1",
            "description": "Short description of how it will be made",
            "estimatedEcoScore": 1.5
          }
        ]
      }
    `;

    const imageParts = [{ inlineData: { data: base64Image, mimeType } }];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    console.log("3. AI Raw Response received successfully.");
    
    // Kyunki responseMimeType laga hai, humein regex (replace) ki zaroorat nahi hai
    aiData = JSON.parse(responseText); 
    console.log(`✅ AI Analysis Pass: Detected [${aiData.detectedMaterial}]`);

  } catch (error) {
    console.error("❌ AI Error Details:", error.message);
    if (error.response) console.error("API Response Error:", error.response.data);
    
    console.log("⚠️ Using Fallback Data because AI failed...");
    aiData = {
      detectedMaterial: "Mixed Recyclables",
      suggestedProducts: [
        { title: "Custom Upcycled Craft", description: "Artisan will suggest an idea.", estimatedEcoScore: 1.0 },
        { title: "Eco Storage Box", description: "A simple storage solution.", estimatedEcoScore: 2.0 },
        { title: "Decorative Planter", description: "Turn it into a beautiful pot.", estimatedEcoScore: 1.5 },
        { title: "Utility Tote", description: "Everyday carry bag.", estimatedEcoScore: 2.5 },
        { title: "Desk Organizer", description: "Keep your workspace clean.", estimatedEcoScore: 1.0 }
      ]
    };
  }

  // --- THE FREE IMAGE HACK ---
  const productsWithImages = aiData.suggestedProducts.map(product => {
    const imagePrompt = `High-quality aesthetic photo of a ${product.title} made from upcycled ${aiData.detectedMaterial}, minimalist background`;
    const encodedPrompt = encodeURIComponent(imagePrompt);
    return {
      ...product,
      generatedImage: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=500&height=500&nologo=true`
    };
  });

  try {
    const newSwap = await Swap.create({
      user: userId,
      wasteImage: imageUrl,
      detectedMaterial: aiData.detectedMaterial,
      suggestedProducts: productsWithImages,
      status: 'pending_artisan'
    });

    console.log("4. Database save successful!");
    res.status(201).json({ message: 'Success', swapData: newSwap });
  } catch (dbError) {
    console.error("❌ DB Save Error:", dbError.message);
    res.status(500).json({ message: 'Failed to save to database' });
  }
};

module.exports = { analyzeWasteImage };