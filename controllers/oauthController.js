const otpService = require('../services/otpService');

exports.oauthCallback = async (req, res) => {
  const user = req.user;
  
  if (user.preferred_mfa === 'email') {
    await otpService.sendAndStoreOTP(user);
  }

  res.send(`
    <script>
      window.opener.postMessage({
        mfa_required: true,
        user_id: '${user.id}',
        preferred_mfa: '${user.preferred_mfa}'
      }, '*');
      window.close();
    </script>
  `);
};
