const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  location: { type: String, default: '' },

  // Password required nahi hai kyunki Google Auth walo ka password nahi hoga
  password: { type: String }, 
  // ... (name, email, password, role ke baad yeh add karo)
  otp: { type: String },
  otpExpires: { type: Date },
  
  // Auth Type & Verification
  authProvider: { 
    type: String, 
    enum: ['local', 'google'], 
    default: 'local' 
  },
  googleId: { type: String }, // Agar Google se aaya hai toh uska ID
  
  isVerified: { type: Boolean, default: false }, // Dashboard access ke liye YES hona zaroori hai
  verificationToken: { type: String }, // Email verification link ya OTP store karne ke liye
  
  // Role & App Data
  role: { 
    type: String, 
    enum: ['user', 'artisan', 'admin'], 
    default: 'user' 
  },
  ecoScore: { type: Number, default: 0 }, // Gamification: Kitna waste save kiya (in kg)
  swapsCompleted: { type: Number, default: 0 },

}, { timestamps: true });

// Pre-save Middleware: Password ko database mein save hone se pehle Encrypt (Hash) karna
userSchema.pre('save', async function() {
  // Agar password modify nahi hua ya ye Google user hai, toh skip karo
  if (!this.isModified('password') || !this.password) {
    return;
  }
  
  // Password hash karo (Security measure)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method: User ke entered password ko DB ke hashed password se compare karne ke liye
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);