import { CookieOptions, NextFunction, Request } from 'express';
import crypto from 'crypto';
import { RegisterSchema, LoginSchema, VerifyEmailSchema } from '../schemas';
import { UserService } from '../services';
import {
   AppError,
   Email,
   getConfig,
   redisClient,
   signJwt,
   verifyJwt,
} from '../utils';
import { User } from '../entities';
import { Res } from '../types';

export class AuthController {
   private static readonly cookiesOptions: CookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      ...(process.env.NODE_ENV === 'production' && {
         secure: true,
      }),
   };

   private static readonly accessTokenCookieOptions: CookieOptions = {
      ...this.cookiesOptions,
      expires: new Date(
         Date.now() + getConfig<number>('accessTokenExpiresIn') * 60 * 1000
      ),
      maxAge: getConfig<number>('accessTokenExpiresIn') * 60 * 1000,
   };

   private static readonly refreshTokenCookieOptions: CookieOptions = {
      ...this.cookiesOptions,
      expires: new Date(
         Date.now() + getConfig<number>('refreshTokenExpiresIn') * 60 * 1000
      ),
      maxAge: getConfig<number>('refreshTokenExpiresIn') * 60 * 1000,
   };

   public static async register(
      req: Request<{}, {}, RegisterSchema>,
      res: Res,
      next: NextFunction
   ) {
      try {
         const { name, email, password } = req.body;

         if (!name || !email || !password) {
            return res.status(400).json({
               status: 'fail',
               message: 'Invalid parameters',
            });
         }

         const newUser = await UserService.create({
            name,
            email: email.toLowerCase(),
            password,
         });

         const { verificationCode, hashedVerificationCode } =
            User.createVerificationCode();
         newUser.verificationCode = hashedVerificationCode;
         await newUser.save();

         const redirectUrl = `${getConfig<string>(
            'origin'
         )}/verifyemail/${verificationCode}`;

         try {
            await new Email(newUser, redirectUrl).sendVerificationCode();
            res.sendStatus(201);
         } catch (error) {
            newUser.verificationCode = null;
            await newUser.save();

            return res.status(500).json({
               status: 'error',
               message: 'There was an error sending email, please try again',
            });
         }
      } catch (err: any) {
         if (err.code === '23505') {
            return res.status(409).json({
               status: 'fail',
               message: 'User with that email already exist',
            });
         }
         next(err);
      }
   }

   public static async verifyEmail(
      req: Request<VerifyEmailSchema>,
      res: Res,
      next: NextFunction
   ) {
      try {
         const verificationCode = crypto
            .createHash('sha256')
            .update(req.params.verificationCode)
            .digest('hex');

         const user = await UserService.find({ verificationCode });

         if (!user) {
            return next(new AppError(401, 'Could not verify email'));
         }

         user.verified = true;
         user.verificationCode = null;
         await user.save();

         res.sendStatus(200);
      } catch (err: any) {
         next(err);
      }
   }

   public static async login(
      req: Request<{}, {}, LoginSchema>,
      res: Res,
      next: NextFunction
   ) {
      try {
         const { email, password } = req.body;
         const user = await UserService.findByEmail(email);

         const isMatched = await User.comparePasswords(
            password,
            user?.password ?? ''
         );

         //1. Check if user exists and password is valid
         if (!user || !isMatched) {
            return next(
               new AppError(400, !user ? 'Invalid email' : 'Invalid password')
            );
         }

         // 2. Check if the user is verified
         if (!user.verified) {
            return next(new AppError(400, 'You are not verified'));
         }

         // 2. Sign Access and Refresh Tokens
         const { access_token, refresh_token } = await UserService.signTokens(
            user
         );

         // 3. Add Cookies
         res.cookie(
            'access_token',
            access_token,
            AuthController.accessTokenCookieOptions
         );
         res.cookie(
            'refresh_token',
            refresh_token,
            AuthController.refreshTokenCookieOptions
         );
         res.cookie('logged_in', true, {
            ...AuthController.accessTokenCookieOptions,
            httpOnly: false,
         });

         // 4. Send response
         res.sendStatus(200);
      } catch (err: any) {
         next(err);
      }
   }

   public static async refreshToken(
      req: Request,
      res: Res,
      next: NextFunction
   ) {
      try {
         const { refresh_token } = req.cookies as { refresh_token: string };

         const message = 'Could not refresh access token';

         if (!refresh_token) {
            return next(new AppError(403, message));
         }

         // Validate refresh token
         const decoded = verifyJwt<{ sub: string }>(
            refresh_token,
            'refreshTokenPublicKey'
         );

         if (!decoded) {
            return next(new AppError(403, message));
         }

         // Check if user has a valid session
         const session = await redisClient.get(decoded.sub);

         if (!session) {
            return next(new AppError(403, message));
         }

         // Check if user still exist
         const user = await UserService.findById(JSON.parse(session).id);

         if (!user) {
            return next(new AppError(403, message));
         }

         // Sign new access token
         const access_token = signJwt(
            { sub: user.id },
            'accessTokenPrivateKey',
            {
               expiresIn: `${getConfig<number>('accessTokenExpiresIn')}m`,
            }
         );

         // 4. Add Cookies
         res.cookie(
            'access_token',
            access_token,
            AuthController.accessTokenCookieOptions
         );
         res.cookie('logged_in', true, {
            ...AuthController.accessTokenCookieOptions,
            httpOnly: false,
         });

         res.sendStatus(200);
      } catch (err: any) {
         next(err);
      }
   }

   public static async logout(req: Request, res: Res, next: NextFunction) {
      try {
         const user = res.locals.user;

         await redisClient.del(user.id);

         res.cookie('access_token', '', { maxAge: 1 });
         res.cookie('refresh_token', '', { maxAge: 1 });
         res.cookie('logged_in', '', { maxAge: 1 });

         res.sendStatus(200);
      } catch (err: any) {
         next(err);
      }
   }
}
