const axios = require('axios');

const generateImageWithHF = async (prompt) => {
  try {
    console.log(`🎨 Generating image for: "${prompt}"...`);

    // Agar Hugging Face ki API key nahi hai, toh seedha fallback par jao
    if (!process.env.HF_API_KEY) {
      throw new Error("HF_API_KEY is missing in .env file");
    }

    // 🔥 FIX: Poora URL daal diya hai yahan 🔥
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      { inputs: prompt },
      { 
        headers: { 
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        responseType: 'arraybuffer' // Image binary format mein aayegi
      }
    );

    // Image ko base64 format mein convert karke return karna (agar Cloudinary use nahi kar rahe directly)
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/jpeg;base64,${base64Image}`;

  } catch (error) {
    // Agar HF server down hai ya timeout ho gaya, toh error print hoga
    console.error("❌ Hugging Face Error:", error.response ? error.response.data.toString() : error.message);
    console.log("🔄 AI is busy. Using Free Fast Fallback Generator...");

    // 🔥 THE MASTER HACK: Pollinations AI Fallback 🔥
    // Agar HF kisi bhi reason se fail hota hai, toh ye 100% free aur bina API key wala generator automatically image bana dega!
    const encodedPrompt = encodeURIComponent(prompt);
    const randomSeed = Math.floor(Math.random() * 100000);
    
    return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=500&height=500&nologo=true&seed=${randomSeed}`;
  }
};

module.exports = { generateImageWithHF };