const otpService = require('../services/otpService');
const totpService = require('../services/totpService');
const userModel = require('../models/userModel');
const jwt = require('../utils/jwt');

/**
 * @swagger
 * /mfa/verify-email:
 *   post:
 *     summary: Verify Email OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
 */
exports.verifyEmailOTP = async (req, res) => {
  try {
    const { user_id, otp } = req.body;
    const user = userModel.findById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await otpService.verifyOTP(user_id, otp);
    
    const token = jwt.generateToken(user);
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /mfa/verify-totp:
 *   post:
 *     summary: Verify Authenticator Code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT
 */
exports.verifyTOTP = async (req, res) => {
  try {
    const { user_id, token: totpToken } = req.body;
    const user = userModel.findById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.totp_enabled) {
      return res.status(400).json({ error: 'TOTP not enabled' });
    }

    const isValid = totpService.verifyTOTP(user.totp_secret, totpToken);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid authenticator code' });
    }

    const jwtToken = jwt.generateToken(user);
    res.status(200).json({ message: 'Login successful', token: jwtToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * @swagger
 * /mfa/setup-totp:
 *   post:
 *     summary: Setup TOTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns secret and QR code
 */
exports.setupTOTP = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    const user = userModel.findById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const secret = totpService.generateSecret();
    userModel.update(user_id, { totp_secret: secret.base32 });

    const qrCode = await totpService.generateQRCode(secret.otpauth_url);
    res.status(200).json({ secret: secret.base32, qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /mfa/enable-totp:
 *   post:
 *     summary: Enable TOTP by verifying first code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: TOTP enabled successfully
 */
exports.enableTOTP = async (req, res) => {
  try {
    const { user_id, token } = req.body;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    const user = userModel.findById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isValid = totpService.verifyTOTP(user.totp_secret, token);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid token, cannot enable TOTP' });
    }

    userModel.update(user_id, { totp_enabled: true, preferred_mfa: 'totp' });
    res.status(200).json({ message: 'TOTP enabled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @swagger
 * /mfa/send-otp:
 *   post:
 *     summary: Send OTP email (if user chose email fallback)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent
 */
exports.sendOTP = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = userModel.findById(user_id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    await otpService.sendAndStoreOTP(user);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
