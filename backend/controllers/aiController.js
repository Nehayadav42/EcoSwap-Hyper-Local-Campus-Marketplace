const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

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

    console.log("2. Sending to Gemini...");

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze this waste/discarded material image.
      1. Identify the primary material.
      2. Suggest EXACTLY 5 creative upcycling product ideas.

      Respond ONLY in JSON:
      {
        "detectedMaterial": "Material name",
        "suggestedProducts": [
          {
            "title": "Idea",
            "description": "How to make it",
            "estimatedEcoScore": 1.5
          }
        ]
      }
    `;

    const imageParts = [{ inlineData: { data: base64Image, mimeType } }];

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();

    aiData = JSON.parse(responseText);

    console.log(`✅ AI Success: ${aiData.detectedMaterial}`);

  } catch (error) {
    console.error("❌ AI Error:", error.message);

    // 🔥 FALLBACK DATA
    aiData = {
      detectedMaterial: "Mixed Recyclables",
      suggestedProducts: [
        { title: "Eco Planter", description: "Use as plant pot", estimatedEcoScore: 1.5 },
        { title: "Storage Box", description: "Useful storage", estimatedEcoScore: 2.0 },
        { title: "Desk Organizer", description: "Organize desk", estimatedEcoScore: 1.2 },
        { title: "Decor Item", description: "Home decoration", estimatedEcoScore: 1.0 },
        { title: "DIY Craft", description: "Creative reuse", estimatedEcoScore: 1.8 }
      ]
    };
  }

  // 🔥 FREE IMAGE GENERATION
 // aiController.js ke andar "--- THE FREE IMAGE HACK ---" wale hisse ko isse replace karo:

const productsWithImages = aiData.suggestedProducts.map(product => {
  // 1. Special characters ko hata kar ekdum clean text banayenge
  const cleanTitle = product.title.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  const cleanMaterial = aiData.detectedMaterial.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  
  // 2. Ekdum crisp prompt jo image AI ko samajh aaye
  const imagePrompt = `professional product photography of ${cleanTitle} made from recycled ${cleanMaterial}, studio lighting, minimalist background`;
  
  // 3. Encode properly
  const encodedPrompt = encodeURIComponent(imagePrompt);
  
  // 4. Random seed add karenge taaki cache ka issue na aaye
  const randomSeed = Math.floor(Math.random() * 10000);

  return {
    ...product,
    generatedImage: `https://image.pollinations.ai/prompt/${encodedPrompt}?width=500&height=500&nologo=true&seed=${randomSeed}`
  };
});

console.log("4. AI processing complete. Sending back to client for selection...");


  res.status(200).json({
    message: 'Success',
    aiData: {
      wasteImage: imageUrl,
      detectedMaterial: aiData.detectedMaterial,
      suggestedProducts: productsWithImages
    }
  });
};

module.exports = { analyzeWasteImage };