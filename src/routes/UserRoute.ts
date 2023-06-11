import { Router } from 'express';
import { UserController } from '../controllers';
import { deserializeUser, requireUser } from '../middlewares';

const router = Router();

router.use(deserializeUser, requireUser);

// Get currently logged in user
router.get('/', UserController.all);
router.get('/me', UserController.me);

export default router;
