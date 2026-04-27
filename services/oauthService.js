const userModel = require('../models/userModel');

const handleOAuthLogin = (profile, provider) => {
  const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : profile.userPrincipalName;
  let user = userModel.findByEmail(email);
  if (!user) {
    user = userModel.create({
      email: email,
      name: profile.displayName,
      provider: provider
    });
  }
  return user;
};

module.exports = {
  handleOAuthLogin
};
