const crypto = require('crypto');
const redisService = require('./redisService');
const emailService = require('./emailService');

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOTP = (otp) => {
  return crypto.createHash('sha256').update(otp).digest('hex');
};

const sendAndStoreOTP = async (user) => {
  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  
  await redisService.setOTP(user.id, otpHash);
  await emailService.sendOTP(user.email, otp);
};

const verifyOTP = async (userId, otp) => {
  const otpData = await redisService.getOTP(userId);
  if (!otpData) {
    throw new Error('OTP expired or not found');
  }
  
  if (otpData.attempts >= 5) {
    await redisService.deleteOTP(userId);
    throw new Error('Max attempts reached. Please request a new OTP.');
  }

  const otpHash = hashOTP(otp);
  if (otpData.otp_hash !== otpHash) {
    const attempts = await redisService.incrementAttempt(userId, otpData);
    throw new Error(`Invalid OTP. Attempts left: ${5 - attempts}`);
  }

  await redisService.deleteOTP(userId);
  return true;
};

module.exports = {
  sendAndStoreOTP,
  verifyOTP
};
