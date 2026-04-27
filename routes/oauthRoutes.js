const express = require('express');
const router = express.Router();
const passport = require('passport');
const oauthController = require('../controllers/oauthController');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login', session: false }), oauthController.oauthCallback);

router.get('/microsoft', passport.authenticate('microsoft', { prompt: 'select_account', session: false }));
router.get('/microsoft/callback', passport.authenticate('microsoft', { failureRedirect: '/login', session: false }), oauthController.oauthCallback);

module.exports = router;
