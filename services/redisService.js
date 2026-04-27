const redisClient = require('../config/redis');

const setOTP = async (userId, otpHash) => {
  const key = `mfa:otp:${userId}`;
  const value = JSON.stringify({
    otp_hash: otpHash,
    attempts: 0,
    expires_at: Date.now() + 5 * 60 * 1000 // 5 minutes
  });
  await redisClient.set(key, value, { EX: 300 }); // Expire in 300 seconds
};

const getOTP = async (userId) => {
  const key = `mfa:otp:${userId}`;
  const value = await redisClient.get(key);
  return value ? JSON.parse(value) : null;
};

const incrementAttempt = async (userId, otpData) => {
  const key = `mfa:otp:${userId}`;
  otpData.attempts += 1;
  const ttl = Math.floor((otpData.expires_at - Date.now()) / 1000);
  if (ttl > 0) {
    await redisClient.set(key, JSON.stringify(otpData), { EX: ttl });
  } else {
    await deleteOTP(userId);
  }
  return otpData.attempts;
};

const deleteOTP = async (userId) => {
  const key = `mfa:otp:${userId}`;
  await redisClient.del(key);
};

module.exports = {
  setOTP,
  getOTP,
  incrementAttempt,
  deleteOTP
};
