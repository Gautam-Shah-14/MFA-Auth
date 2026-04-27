const redis = require('redis');
const env = require('./env');

const redisClient = redis.createClient({
  url: env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

module.exports = redisClient;
