const userModel = require('../models/userModel');
const crypto = require('crypto');
const otpService = require('./otpService');

const login = async (email, password) => {
  const user = userModel.findByEmail(email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  if (user.passwordHash !== passwordHash) {
    throw new Error('Invalid email or password');
  }

  if (user.preferred_mfa === 'email') {
    await otpService.sendAndStoreOTP(user);
  }
  
  return { mfa_required: true, user_id: user.id, preferred_mfa: user.preferred_mfa };
};

const register = async (email, password, name) => {
  const existing = userModel.findByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }

  const passwordHash = crypto.createHash('sha256').update(password).digest('hex');
  const user = userModel.create({
    email,
    passwordHash,
    name
  });

  return user;
};

module.exports = {
  login,
  register
};
