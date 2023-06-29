import dotenv from 'dotenv';
dotenv.config();
import express, { Request, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import {
   AppDataSource,
   AppError,
   getConfig,
   redisClient,
   validateEnv,
} from './utils';
import { authRouter, postRouter, userRouter } from './routes';
import { Res } from './types';

AppDataSource.initialize()
   .then(async () => {
      // VALIDATE ENV
      validateEnv();

      const app = express();

      // TEMPLATE ENGINE
      app.set('view engine', 'pug');
      app.set('views', `${__dirname}/views`);

      // MIDDLEWARE

      // 1. Body parser
      app.use(express.json({ limit: '10kb' }));

      // 2. Logger
      if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

      // 3. Cookie Parser
      app.use(cookieParser());

      // 4. Cors
      app.use(
         cors({
            origin: [getConfig<string>('origin'), 'http://localhost:5173'],
            methods: 'GET,POST,PATCH,DELETE',
            allowedHeaders: 'Content-Type,Authorization',
            exposedHeaders: 'Content-Length,ETag',
            credentials: true,
            optionsSuccessStatus: 200,
         })
      );

      // 5. Helmet
      app.use(
         helmet({
            contentSecurityPolicy: {
               directives: {
                  defaultSrc: ["'self'"],
                  scriptSrc: ["'self'", "'unsafe-inline'"],
                  styleSrc: ["'self'", "'unsafe-inline'"],
               },
            },
            hsts: {
               maxAge: 31536000, // 1 year in seconds
               includeSubDomains: false,
               preload: true,
            },
         })
      );

      // ROUTES
      app.use('/api/v1/auth', authRouter);
      app.use('/api/v1/users', userRouter);
      app.use('/api/v1/posts', postRouter);

      // HEALTH CHECKER
      app.get('/api/v1/health', async (_, res: Res) => {
         const message = await redisClient.get('try');

         res.json({
            status: 'success',
            message,
         });
      });

      // UNHANDLED ROUTE
      app.all('*', (req: Request, res: Res, next: NextFunction) => {
         next(new AppError(404, `Route ${req.originalUrl} not found`));
      });

      // GLOBAL ERROR HANDLER
      app.use((error: AppError, req: Request, res: Res, next: NextFunction) => {
         error.status = error.status || 'error';
         error.statusCode = error.statusCode || 500;

         console.log('error', error);

         res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
         });
      });

      const port = getConfig<number>('port');
      app.listen(port);

      console.log(`Server started on port: ${port}`);
   })
   .catch(error => console.error(error));
