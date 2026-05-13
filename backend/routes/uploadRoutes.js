const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary and return URL
router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }
    
    // Cloudinary successfully upload karne ke baad ek secure URL return karta hai
    res.status(200).json({
      message: 'Image uploaded successfully!',
      imageUrl: req.file.path // Yeh URL hum DB mein aur AI ko denge
    });
  } catch (error) {
    console.error("❌ Asli Upload Error:", error); // ✅ Ye pura error print karega
    res.status(500).json({ message: error.message || "Upload failed" });
  }
});

module.exports = router;