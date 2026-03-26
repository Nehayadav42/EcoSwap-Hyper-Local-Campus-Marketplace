const crypto = require('crypto');

function generateOtp6() {
  // Ensures leading zeros are allowed (e.g., "004912").
  return String(crypto.randomInt(0, 1000000)).padStart(6, '0');
}

function ttlMs() {
  const seconds = Number(process.env.OTP_TTL_SECONDS || 600);
  return Math.max(30, seconds * 1000);
}

function nowMs() {
  return Date.now();
}

module.exports = { generateOtp6, ttlMs, nowMs };

