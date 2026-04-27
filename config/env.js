require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 3000,
  SESSION_SECRET: process.env.SESSION_SECRET || 'secret',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt-secret',
  EMAIL: {
    SERVICE: process.env.EMAIL_SERVICE || 'hotmail',
    USERNAME: process.env.EMAIL_USERNAME,
    PASSWORD: process.env.EMAIL_PASSWORD
  },
  AZURE: {
    CONNECTION_STRING: process.env.AZURE_EMAIL_CONNECTION_STRING,
    SENDER: process.env.AZURE_EMAIL_SENDER
  },
  GOOGLE: {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL
  },
  MICROSOFT: {
    CLIENT_ID: process.env.MICROSOFT_CLIENT_ID,
    CLIENT_SECRET: process.env.MICROSOFT_CLIENT_SECRET,
    CALLBACK_URL: process.env.MICROSOFT_CALLBACK_URL
  }
};
