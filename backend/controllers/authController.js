const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user (Manual)
const registerUser = async (req, res) => {
  const { name, email, password, role, location } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 6-digit OTP Generate karo
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    const user = await User.create({
      name,
      email,
      password,
      authProvider: 'local',
      role: role || 'user',
      location: typeof location === 'string' ? location.trim() : '',
      otp,
      otpExpires
    });

    if (user) {
       const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // 2. Email ka Design aur Content
      const mailOptions = {
        from: `"EcoSwap Team" <${process.env.EMAIL_USER}>`,
        to: email, // Jisne signup kiya hai
        subject: '🌱 Verify Your EcoSwap Account',
        html: `
          <div style="font-family: Arial, sans-serif; max-w: 500px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; text-align: center;">
            <h2 style="color: #111827;">Welcome to EcoSwap!</h2>
            <p style="color: #4b5563; font-size: 16px;">We are thrilled to have you join our sustainable community. Please use the OTP below to verify your email address.</p>
            <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
              <h1 style="color: #10B981; font-size: 32px; letter-spacing: 8px; margin: 0;">${otp}</h1>
            </div>
            <p style="color: #9ca3af; font-size: 12px;">This OTP is valid for 10 minutes. Do not share it with anyone.</p>
          </div>
        `
      };

      // 3. Email Send Karo
      await transporter.sendMail(mailOptions);
      console.log(`✅ Real Email sent to ${email}`);

      // 👆 NODEMAILER EMAIL LOGIC ENDS HERE 👆

      res.status(201).json({
        message: 'OTP sent to your email! Please check your inbox.',
        userId: user._id
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};
// @desc    Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP match!
    user.isVerified = true;
    user.otp = undefined; 
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ 
      message: "Verification successful", 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location || '',
      },
      token: generateToken(user._id) 
    });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

// @desc    Auth user & get token (Manual Login)
const loginUser = async (req, res) => {
  const { email, password, location } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // if (!user.isVerified) {
      //   return res.status(401).json({ message: 'Please verify your email first.' });
      // } 
      if (typeof location === 'string' && location.trim()) {
        user.location = location.trim();
        await user.save();
      }

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location || '',
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
const googleAuth = async (req, res) => {
  const { tokenId, role, location } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const { email, name, sub: googleId } = ticket.getPayload();

    let user = await User.findOne({ email });
    const loc = typeof location === 'string' ? location.trim() : '';

    if (!user) {
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        isVerified: true,
        role: role || 'user',
        location: loc,
      });
    } else if (loc) {
      user.location = loc;
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location || '',
      token: generateToken(user._id),
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

const getAllArtisans = async (req, res) => {
  try {
    // Sirf 'artisan' role wale users dhoondho, aur unka password/otp exclude kar do
    const artisans = await User.find({ role: 'artisan' })
      .select('-password -otp -otpExpires')
      .sort({ createdAt: -1 }); // Naye artisans pehle dikhenge
      
    res.status(200).json(artisans);
  } catch (error) {
    console.error("❌ Error fetching artisans:", error);
    res.status(500).json({ message: "Failed to fetch artisans" });
  }
};

module.exports = { registerUser, loginUser, googleAuth, verifyOTP, getAllArtisans};