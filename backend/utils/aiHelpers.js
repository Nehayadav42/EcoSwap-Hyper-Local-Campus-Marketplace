// backend/utils/aiHelpers.js (ya tumhare controller file mein)
const axios = require('axios');

const generateImageWithHF = async (prompt) => {
  try {
    // Stable Diffusion v1.5 (Fast aur reliable for free tier)
    const API_URL = "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5";
    
    console.log(`🎨 Generating image for: "${prompt}"...`);

    const response = await axios.post(
      API_URL,
      { inputs: prompt },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer", // ⚠️ Ye bahut zaroori hai image receive karne ke liye!
      }
    );

    // Buffer ko Base64 mein convert karo taaki browser seedha padh sake
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    
    console.log("✅ Image successfully generated!");
    return imageUrl;

} catch (error) {
    // Buffer ko text mein convert kar rahe hain taaki exactly error samajh aaye
    const errorBody = error.response?.data 
      ? error.response.data.toString('utf8') 
      : error.message;
      
    console.error("❌ HF Image Gen Error:", errorBody);
    return null; 
  }
};

module.exports = { generateImageWithHF };