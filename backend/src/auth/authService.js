const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
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

/** Legacy Atlas users may omit `verified`; treat as verified unless explicitly false. */
function isUserVerified(user) {
  if (!user) return false;
  if (user.verified === true) return true;
  if (user.verified === false) return false;
  return true;
}

/** Supports bcrypt hashes and legacy plaintext passwords (migrates to bcrypt on successful login). */
async function comparePassword(user, plain) {
  const stored = user.password;
  if (!stored || typeof plain !== 'string') return false;
  if (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) {
    return bcrypt.compare(plain, stored);
  }
  if (plain === stored) {
    const hash = await bcrypt.hash(plain, 10);
    await User.updateOne({ _id: user._id }, { $set: { password: hash } });
    return true;
  }
  return false;
}

async function registerUser({ email, password, firstName, lastName, college, yearOfStudy }) {
  const requireEduEmail = process.env.REQUIRE_EDU_EMAIL === 'true';
  if (requireEduEmail && !isEduInEmail(email)) {
    return { ok: false, statusCode: 400, error: 'Only .edu.in emails are accepted.' };
  }
  if (!password || password.length < 8) {
    return { ok: false, statusCode: 400, error: 'Password must be at least 8 characters.' };
  }

  const emailKey = String(email).toLowerCase().trim();
  const existing = await User.findOne({ email: emailKey });

  if (existing && isUserVerified(existing)) {
    return { ok: false, statusCode: 400, error: 'An account with this email already exists.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const code = generateOtp6();
  const codeHash = await hashText(code);
  const otpExpiresAt = new Date(nowMs() + ttlMs());

  const fn = trimStr(firstName) || (existing && existing.firstName) || '';
  const ln = trimStr(lastName) || (existing && existing.lastName) || '';
  const col = trimStr(college) || (existing && existing.college) || '';
  const yr = trimStr(yearOfStudy) || (existing && existing.yearOfStudy) || '';

  if (existing) {
    await User.updateOne(
      { _id: existing._id },
      {
        $set: {
          firstName: fn,
          lastName: ln,
          college: col,
          yearOfStudy: yr,
          password: passwordHash,
          verified: false,
          otpCodeHash: codeHash,
          otpExpiresAt
        }
      }
    );
  } else {
    await User.create({
      email: emailKey,
      firstName: fn,
      lastName: ln,
      college: col,
      yearOfStudy: yr,
      password: passwordHash,
      verified: false,
      ecoPoints: 0,
      otpCodeHash: codeHash,
      otpExpiresAt
    });
  }

  await sendOtpEmail({ to: emailKey, code });

  return { ok: true };
}

async function resendCode({ email }) {
  const emailKey = String(email || '').toLowerCase().trim();
  const user = await User.findOne({ email: emailKey });
  if (!user) return { ok: false, statusCode: 404, error: 'User not found.' };
  if (isUserVerified(user)) return { ok: false, statusCode: 400, error: 'Email already verified.' };

  const code = generateOtp6();
  const codeHash = await hashText(code);
  const otpExpiresAt = new Date(nowMs() + ttlMs());

  await User.updateOne(
    { _id: user._id },
    { $set: { otpCodeHash: codeHash, otpExpiresAt } }
  );

  await sendOtpEmail({ to: emailKey, code });

  return { ok: true };
}

async function verifyEmailOtp({ email, code }) {
  const emailKey = String(email || '').toLowerCase().trim();
  const user = await User.findOne({ email: emailKey });
  if (!user) return { ok: false, statusCode: 404, error: 'User not found.' };
  if (user.verified === true) return { ok: false, statusCode: 400, error: 'Email already verified.' };

  if (!user.otpCodeHash) {
    return { ok: false, statusCode: 400, error: 'No OTP found. Please resend.' };
  }
  if (!user.otpExpiresAt || user.otpExpiresAt.getTime() < nowMs()) {
    return { ok: false, statusCode: 400, error: 'OTP expired. Please resend.' };
  }

  const ok = await verifyText(user.otpCodeHash, code);
  if (!ok) return { ok: false, statusCode: 400, error: 'Invalid code.' };

  await User.updateOne(
    { _id: user._id },
    { $set: { verified: true }, $unset: { otpCodeHash: '', otpExpiresAt: '' } }
  );

  const token = signToken({ email: emailKey, verified: true });
  return { ok: true, token };
}

async function getUserProfile(email) {
  const key = String(email || '').toLowerCase().trim();
  const user = await User.findOne({ email: key }).lean();
  if (!user) return null;
  return {
    email: user.email,
    verified: isUserVerified(user),
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    college: user.college || '',
    yearOfStudy: user.yearOfStudy || '',
    phone: user.phone || '',
    ecoPoints: typeof user.ecoPoints === 'number' ? user.ecoPoints : 0
  };
}

async function updateProfile(email, body = {}) {
  const key = String(email || '').toLowerCase().trim();
  const user = await User.findOne({ email: key });
  if (!user) return { ok: false, statusCode: 404, error: 'User not found.' };

  if (Object.prototype.hasOwnProperty.call(body, 'phone')) {
    const p = body.phone;
    user.phone = typeof p === 'string' ? p.trim() : '';
    await user.save();
  }

  return { ok: true, profile: await getUserProfile(key) };
}

async function login({ email, password }) {
  const emailKey = String(email || '').toLowerCase().trim();
  const user = await User.findOne({ email: emailKey });
  if (!user) return { ok: false, statusCode: 401, error: 'Invalid email or password.' };

  const passOk = await comparePassword(user, password);
  if (!passOk) return { ok: false, statusCode: 401, error: 'Invalid email or password.' };

  if (!isUserVerified(user)) {
    return { ok: false, statusCode: 403, error: 'Email not verified.', verified: false };
  }

  const token = signToken({ email: emailKey, verified: true });
  return { ok: true, token };
}

module.exports = {
  registerUser,
  resendCode,
  verifyEmailOtp,
  login,
  getUserProfile,
  updateProfile
};
