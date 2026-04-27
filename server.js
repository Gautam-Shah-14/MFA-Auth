const app = require('./app');
const env = require('./config/env');
const redisClient = require('./config/redis');

const PORT = env.PORT;

const startServer = async () => {
  try {
    // Ensure redis is connected before starting
    await redisClient.connect();
    console.log('Connected to Redis');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
