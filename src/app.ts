require('dotenv').config();
import express, { Response } from 'express';
import config from 'config';
import { validateEnv, AppDataSource, redisClient } from './utils';

AppDataSource.initialize()
   .then(async () => {
      // VALIDATE ENV
      validateEnv();

      const app = express();

      // MIDDLEWARE

      // 1. Body parser

      // 2. Logger

      // 3. Cookie Parser

      // 4. Cors

      // ROUTES

      // HEALTH CHECKER
      app.get('/api/v1/health', async (_, res: Response) => {
         const message = await redisClient.get('try');
         res.json({
            status: 'success',
            message,
         });
      });

      // UNHANDLED ROUTE

      // GLOBAL ERROR HANDLER

      const port = config.get<number>('port');
      app.listen(port);

      console.log(`Server started on port: ${port}`);
   })
   .catch(error => console.log(error));
