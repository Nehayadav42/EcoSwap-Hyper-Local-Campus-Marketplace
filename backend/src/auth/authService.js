const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { readDb, writeDb } = require('../storage/db');
const { generateOtp6, ttlMs, nowMs } = require('../utils/otp');
const { sendOtpEmail } = require('../email/mailer');

function isEduInEmail(email) {
  return typeof email === 'string' && email.toLowerCase().endsWith('.edu.in');
}

async function hashText(text) {
  const rounds = Number(process.env.OTP_BCRYPT_ROUNDS || 10);
  return bcrypt.hash(text, rounds);
}

async function verifyText(hash, text) {
  return bcrypt.compare(text, hash);
}

function signToken({ email, verified }) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  return jwt.sign({ sub: email, verified }, secret, { expiresIn });
}

function trimStr(v) {
  if (typeof v !== 'string') return '';
  return v.trim();
}

async function registerUser({ email, password, firstName, lastName, college, yearOfStudy }) {
  const requireEduEmail = process.env.REQUIRE_EDU_EMAIL === 'true';
  if (requireEduEmail && !isEduInEmail(email)) {
    return { ok: false, statusCode: 400, error: 'Only .edu.in emails are accepted.' };
  }
  if (!password || password.length < 8) {
    return { ok: false, statusCode: 400, error: 'Password must be at least 8 characters.' };
  }

  const db = readDb();
  const existing = db.users[email.toLowerCase()];

  const passwordHash = existing ? existing.passwordHash : await bcrypt.hash(password, 10);

  const code = generateOtp6();
  const codeHash = await hashText(code);
  const otpExpiresAt = nowMs() + ttlMs();

  const fn = trimStr(firstName) || (existing && existing.firstName) || '';
  const ln = trimStr(lastName) || (existing && existing.lastName) || '';
  const col = trimStr(college) || (existing && existing.college) || '';
  const yr = trimStr(yearOfStudy) || (existing && existing.yearOfStudy) || '';

  db.users[email.toLowerCase()] = {
    email: email.toLowerCase(),
    passwordHash,
    verified: existing ? existing.verified : false,
    createdAt: existing ? existing.createdAt : new Date().toISOString(),
    firstName: fn,
    lastName: ln,
    college: col,
    yearOfStudy: yr
  };

  db.otps[email.toLowerCase()] = {
    codeHash,
    expiresAt: otpExpiresAt,
    createdAt: new Date().toISOString()
  };

  writeDb(db);

  await sendOtpEmail({ to: email.toLowerCase(), code });

  return { ok: true };
}

async function resendCode({ email }) {
  const db = readDb();
  const user = db.users[email.toLowerCase()];
  if (!user) return { ok: false, statusCode: 404, error: 'User not found.' };
  if (user.verified) return { ok: false, statusCode: 400, error: 'Email already verified.' };

  const code = generateOtp6();
  const codeHash = await hashText(code);
  const otpExpiresAt = nowMs() + ttlMs();

  db.otps[email.toLowerCase()] = {
    codeHash,
    expiresAt: otpExpiresAt,
    createdAt: new Date().toISOString()
  };

  writeDb(db);

  await sendOtpEmail({ to: email.toLowerCase(), code });

  return { ok: true };
}

async function verifyEmailOtp({ email, code }) {
  const db = readDb();
  const key = email.toLowerCase();
  const user = db.users[key];
  if (!user) return { ok: false, statusCode: 404, error: 'User not found.' };
  if (user.verified) return { ok: false, statusCode: 400, error: 'Email already verified.' };

  const otp = db.otps[key];
  if (!otp) return { ok: false, statusCode: 400, error: 'No OTP found. Please resend.' };
  if (nowMs() > otp.expiresAt) return { ok: false, statusCode: 400, error: 'OTP expired. Please resend.' };

  const ok = await verifyText(otp.codeHash, code);
  if (!ok) return { ok: false, statusCode: 400, error: 'Invalid code.' };

  user.verified = true;
  delete db.otps[key];
  writeDb(db);

  const token = signToken({ email: key, verified: true });
  return { ok: true, token };
}

function getUserProfile(email) {
  const db = readDb();
  const key = String(email || '').toLowerCase();
  const user = db.users[key];
  if (!user) return null;
  return {
    email: user.email,
    verified: !!user.verified,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    college: user.college || '',
    yearOfStudy: user.yearOfStudy || ''
  };
}

async function login({ email, password }) {
  const db = readDb();
  const key = email.toLowerCase();
  const user = db.users[key];
  if (!user) return { ok: false, statusCode: 401, error: 'Invalid email or password.' };

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { ok: false, statusCode: 401, error: 'Invalid email or password.' };

  if (!user.verified) {
    return { ok: false, statusCode: 403, error: 'Email not verified.', verified: false };
  }

  const token = signToken({ email: key, verified: true });
  return { ok: true, token };
}

module.exports = {
  registerUser,
  resendCode,
  verifyEmailOtp,
  login,
  getUserProfile
};

