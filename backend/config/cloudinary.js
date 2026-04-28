const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// 1. Cloudinary ko apne credentials se connect karo
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Storage engine setup karo (Ye batayega image kahan aur kis format mein save hogi)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecoswap_waste_images', // Cloudinary ke andar is folder mein images jayengi
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

// 3. Multer upload middleware banao
const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };