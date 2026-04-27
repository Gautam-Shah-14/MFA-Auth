const express = require('express');
const router = express.Router();
const mfaController = require('../controllers/mfaController');

router.post('/verify-email', mfaController.verifyEmailOTP);
router.post('/verify-totp', mfaController.verifyTOTP);
router.post('/send-otp', mfaController.sendOTP);

router.post('/setup-totp', mfaController.setupTOTP);
router.post('/enable-totp', mfaController.enableTOTP);

module.exports = router;
