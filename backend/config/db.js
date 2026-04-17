const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // process.env.MONGO_URI humari .env file se aayega
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Agar DB connect na ho toh server band kar do
  }
};

module.exports = connectDB;