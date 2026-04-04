const mongoose = require('mongoose');

/**
 * Matches Atlas `test.users` shape used by the team (firstName, lastName, email, college, yearOfStudy, password, ecoPoints).
 * OTP fields support the email verification flow; legacy users without `verified`/`otpCodeHash` can still log in.
 */
const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    college: { type: String, default: '' },
    yearOfStudy: { type: String, default: '' },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    ecoPoints: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    otpCodeHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null }
  },
  { timestamps: true, collection: 'users' }
);

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
