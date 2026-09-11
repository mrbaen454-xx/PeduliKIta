const jwt = require('jsonwebtoken');
const env = require('../config/environment');

const generateToken = (payload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '1d' });
};

const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
