import { Router } from 'express';
import { PostController } from '../controllers';
import { deserializeUser, requireUser, validate } from '../middlewares';
import {
   createPostSchema,
   deletePostSchema,
   getPostSchema,
   updatePostSchema,
} from '../schemas';

const router = Router();

router.use(deserializeUser, requireUser);

router
   .route('/')
   .get(PostController.index)
   .post(validate(createPostSchema), PostController.create);

router
   .route('/:postId')
   .get(validate(getPostSchema), PostController.show)
   .patch(validate(updatePostSchema), PostController.update)
   .delete(validate(deletePostSchema), PostController.delete);

export default router;
