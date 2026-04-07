const redis = require("redis");

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("ERROR IN REDIS CLIENT: ", err));

const connectRedis = async () => {
  await redisClient.connect();
  console.log("Redis connected");
};

module.exports = { connectRedis, redisClient };
