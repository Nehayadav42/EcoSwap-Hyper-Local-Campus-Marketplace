const jwt = require('jsonwebtoken');

function requireAuth({ requireVerified } = {}) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;
      if (requireVerified && !payload.verified) {
        return res.status(403).json({ error: 'Email not verified' });
      }
      return next();
    } catch (_e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

module.exports = { requireAuth };

