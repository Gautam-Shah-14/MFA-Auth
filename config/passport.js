const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const env = require('./env');
const userModel = require('../models/userModel');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = userModel.findById(id);
  done(null, user);
});

const oauthService = require('../services/oauthService');

if (env.GOOGLE.CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: env.GOOGLE.CLIENT_ID,
    clientSecret: env.GOOGLE.CLIENT_SECRET,
    callbackURL: env.GOOGLE.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    const user = oauthService.handleOAuthLogin(profile, 'google');
    return cb(null, user);
  }));
}

if (env.MICROSOFT.CLIENT_ID) {
  passport.use(new MicrosoftStrategy({
    clientID: env.MICROSOFT.CLIENT_ID,
    clientSecret: env.MICROSOFT.CLIENT_SECRET,
    callbackURL: env.MICROSOFT.CALLBACK_URL,
    scope: ['user.read']
  },
  function(accessToken, refreshToken, profile, cb) {
    const user = oauthService.handleOAuthLogin(profile, 'microsoft');
    return cb(null, user);
  }));
}

module.exports = passport;
