import { createClient } from 'redis';

const redisUrl = 'redis://localhost:6379';

export const redisClient = createClient({
   url: redisUrl,
});

const connectRedis = async () => {
   try {
      await redisClient.connect();
      console.log('Redis client connected successfully');
      redisClient.set('try', 'Hello Welcome to Express with TypeORM');
   } catch (error) {
      console.error(error);
      setTimeout(connectRedis, 5000);
   }
};

connectRedis();
