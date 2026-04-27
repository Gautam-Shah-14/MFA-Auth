const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
