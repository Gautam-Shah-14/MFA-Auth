const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Initialize passport config
require('./config/passport');

// Import routes
const authRoutes = require('./routes/authRoutes');
const mfaRoutes = require('./routes/mfaRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Static files for basic UI
app.use(express.static('public'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/auth', authRoutes);
app.use('/mfa', mfaRoutes);
app.use('/oauth', oauthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

module.exports = app;
