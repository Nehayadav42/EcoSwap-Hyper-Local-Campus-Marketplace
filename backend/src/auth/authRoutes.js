const express = require('express');
const rateLimit = require('express-rate-limit');

const { requireAuth } = require('../middleware/requireAuth');
const {
  registerUser,
  resendCode,
  verifyEmailOtp,
  login
} = require('./authService');

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20
});

router.post('/register', otpLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const result = await registerUser({ email, password });
    if (!result.ok) return res.status(result.statusCode).json({ error: result.error });
    return res.json({ ok: true });
  } catch (e) {
    return next(e);
  }
});

router.post('/resend', otpLimiter, async (req, res, next) => {
  try {
    const { email } = req.body || {};
    const result = await resendCode({ email });
    if (!result.ok) return res.status(result.statusCode).json({ error: result.error });
    return res.json({ ok: true });
  } catch (e) {
    return next(e);
  }
});

router.post('/verify', otpLimiter, async (req, res, next) => {
  try {
    const { email, code } = req.body || {};
    const result = await verifyEmailOtp({ email, code });
    if (!result.ok) return res.status(result.statusCode).json({ error: result.error });
    return res.json({ ok: true, token: result.token });
  } catch (e) {
    return next(e);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    const result = await login({ email, password });
    if (!result.ok) return res.status(result.statusCode).json({ error: result.error, verified: result.verified });
    return res.json({ ok: true, token: result.token });
  } catch (e) {
    return next(e);
  }
});

router.get('/me', requireAuth(), (req, res) => {
  return res.json({
    email: req.user.sub,
    verified: !!req.user.verified
  });
});

// Example protected endpoint for authorization testing.
router.get('/protected', requireAuth({ requireVerified: true }), (req, res) => {
  return res.json({ ok: true, email: req.user.sub });
});

module.exports = router;

