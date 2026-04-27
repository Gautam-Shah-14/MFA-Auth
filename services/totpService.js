const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

const generateSecret = (email) => {
  const secret = speakeasy.generateSecret({ 
    length: 20,
    name: `TrueArmor:${email}`
  });
  return secret;
};

const generateQRCode = async (secretUrl) => {
  return await QRCode.toDataURL(secretUrl);
};

const verifyTOTP = (secret, token) => {
  return speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 1
  });
};

module.exports = {
  generateSecret,
  generateQRCode,
  verifyTOTP
};
