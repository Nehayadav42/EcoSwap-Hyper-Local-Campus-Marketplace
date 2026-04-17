const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Token 30 days ke liye valid rahega
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;