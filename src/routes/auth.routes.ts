import { Router } from 'express';
import { AuthController } from '../controllers';
import { deserializeUser, requireUser, validate } from '../middlewares';
import { registerSchema, loginSchema, verifyEmailSchema } from '../schemas';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);
router.get('/logout', deserializeUser, requireUser, AuthController.logout);
router.get('/refresh', AuthController.refreshToken);
router.get(
   '/verifyemail/:verificationCode',
   validate(verifyEmailSchema),
   AuthController.verifyEmail
);

export default router;
