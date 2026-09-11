const jwt = require('jsonwebtoken');
const env = require('../config/environment');

const generateToken = (payload) => {
  let expiresIn = env.JWT_EXPIRES_IN;
  if (typeof expiresIn === 'string') {
    expiresIn = expiresIn.replace(/['"]/g, '').trim();
  }
  if (!expiresIn) {
    expiresIn = '1d';
  }
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
