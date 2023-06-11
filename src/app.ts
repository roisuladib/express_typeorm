require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import {
   validateEnv,
   AppDataSource,
   redisClient,
   AppError,
   getConfig,
} from './utils';
import { authRouter, userRouter } from './routes';

AppDataSource.initialize()
   .then(async () => {
      // VALIDATE ENV
      validateEnv();

      const app = express();

      // TEMPLATE ENGINE

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
            origin: getConfig<string>('origin'),
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
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
               includeSubDomains: true,
               preload: true,
            },
         })
      );

      // ROUTES
      app.use('/api/v1/auth', authRouter);
      app.use('/api/v1/users', userRouter);

      // HEALTH CHECKER
      app.get('/api/v1/health', async (_, res: Response) => {
         const message = await redisClient.get('try');

         res.status(200).json({
            status: 'success',
            message,
         });
      });

      // UNHANDLED ROUTE
      app.all('*', (req: Request, res: Response, next: NextFunction) => {
         next(new AppError(404, `Route ${req.originalUrl} not found`));
      });

      // GLOBAL ERROR HANDLER
      app.use(
         (error: AppError, req: Request, res: Response, next: NextFunction) => {
            error.status = error.status || 'error';
            error.statusCode = error.statusCode || 500;

            res.status(error.statusCode).json({
               status: error.status,
               message: error.message,
            });
         }
      );

      const port = getConfig<number>('port');
      app.listen(port);

      console.log(`Server started on port: ${port}`);
   })
   .catch(error => console.log(error));
