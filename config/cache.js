// config/cache.js
const Redis = require("redis");
const redisClient = Redis.createClient();

redisClient.on("error", (error) => {
    console.error("Redis error:", error);
});

module.exports = redisClient;
