const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');

// Google Client setup
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user (Manual)
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Naya user create karo (isVerified: false default hoga schema se)
    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local'
    });

    if (user) {
      // TODO: Yahan Nodemailer se verification email bhejne ka code aayega.
      // Abhi ke liye hum response bhej rahe hain ki email check karo.
      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account.',
        userId: user._id
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token (Manual Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      
      // IMPORTANT: Check if verified
      // (Abhi testing ke liye isko comment kar sakte ho, baad mein uncomment karna)
      /* if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first.' });
      } 
      */

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Login / Signup
// @route   POST /api/auth/google
const googleAuth = async (req, res) => {
  const { tokenId } = req.body; // Frontend se Google ka token aayega

  try {
    // Google ke server se token verify karo
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name, sub: googleId } = ticket.getPayload();

    // Check karo agar user pehle se hai
    let user = await User.findOne({ email });

    if (!user) {
      // Agar user nahi hai, toh naya banao aur auto-verify kar do
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        isVerified: true, // Google verified hai!
      });
    }

    // Login successful, token bhej do
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

module.exports = { registerUser, loginUser, googleAuth };