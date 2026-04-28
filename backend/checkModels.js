const axios = require('axios');
require('dotenv').config();

async function checkAvailableModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.log("❌ Error: GEMINI_API_KEY is not found in .env file.");
    return;
  }

  console.log("🔍 Fetching available Google AI Models...");

  try {
    const response = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    
    console.log("\n✅ AVAILABLE MODELS:");
    console.log("--------------------------------------------------");
    
    response.data.models.forEach(model => {
      // Humein wahi model chahiye jo "generateContent" support kare
      if (model.supportedGenerationMethods.includes("generateContent")) {
         console.log(`Model Name:  ${model.name}`);
         console.log(`Description: ${model.description}`);
         console.log("--------------------------------------------------");
      }
    });

  } catch (error) {
    console.error("❌ Error fetching models:", error.response?.data || error.message);
  }
}

checkAvailableModels();