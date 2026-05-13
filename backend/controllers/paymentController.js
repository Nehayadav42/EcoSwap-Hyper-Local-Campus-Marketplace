const Listing = require('../models/Listing')
const Razorpay = require('razorpay');


const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // Razorpay instance initialize kar rahe hain
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    // Order configuration
    const options = {
      amount: amount * 100, // Razorpay amount ko paise mein leta hai (e.g. ₹500 = 50000 paise)
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    // Order create karna
    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).send("Some error occured in creating order");
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// backend/controllers/paymentController.js

const verifyPayment = async (req, res) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, productId } = req.body;
  
      const product = await Listing.findById(productId);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      // Agar database mein stock ki field hai aur wo 1 se zyada hai, toh 1 minus karo
      // Agar stock field nahi hai (purane products), toh usko default 0 kardo (yani Sold Out)
      if (product.stock && product.stock > 1) {
        product.stock = product.stock - 1;
      } else {
        product.stock = 0; 
      }
  
      await product.save(); // Data save kar diya, delete NAHI kiya!
  
      console.log(`✅ Order Success! Product ${productId} stock updated to ${product.stock}.`);
  
      res.status(200).json({ 
        success: true, 
        message: "Payment verified and stock updated!" 
      });
  
    } catch (error) {
      console.error("Verification Error:", error);
      res.status(500).json({ message: "Server error during verification" });
    }
  };

module.exports = { createOrder, verifyPayment };