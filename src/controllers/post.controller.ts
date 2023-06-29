import { Request, NextFunction } from 'express';
import { PostService, UserService } from '../services';
import { PageLimit, Res, TypedRequestBody, TypedRequestQuery } from '../types';
import { User } from '../entities';
import { AppError, extractPageLimitParams, paginateResponse } from '../utils';
import { CreatePost, DeletePost, GetPost, UpdatePost } from '../schemas';

export class PostController {
   public static async index(
      req: TypedRequestQuery<PageLimit>,
      res: Res,
      next: NextFunction
   ) {
      try {
         const { page, limit, skip } = extractPageLimitParams(req);
         const data = await PostService.index({
            skip,
            take: limit,
         });
         paginateResponse(res, data, page, limit);
      } catch (err: any) {
         next(err);
      }
   }

   public static async show(
      req: Request<GetPost>,
      res: Res,
      next: NextFunction
   ) {
      try {
         const post = await PostController.findPostById(
            req.params.postId,
            next
         );
         if (!post) {
            return;
         }
         res.json(post);
      } catch (err: any) {
         next(err);
      }
   }

   public static async create(
      req: TypedRequestBody<CreatePost>,
      res: Res,
      next: NextFunction
   ) {
      try {
         const user = await UserService.findById(res.locals.user.id as string);
         const post = await PostService.create(req.body, user as User);
         res.status(201).json(post);
      } catch (err: any) {
         if (err.code === '23505') {
            return res.status(409).json({
               status: 'fail',
               message: 'Post with that title already exist',
            });
         }
         next(err);
      }
   }

   public static async update(
      req: Request<UpdatePost['params'], {}, UpdatePost['body']>,
      res: Res,
      next: NextFunction
   ) {
      try {
         const post = await PostController.findPostById(
            req.params.postId,
            next
         );
         if (!post) {
            return;
         }
         Object.assign(post, req.body);
         await post.save();
         res.sendStatus(200);
      } catch (err: any) {
         next(err);
      }
   }

   public static async delete(
      req: Request<DeletePost>,
      res: Res,
      next: NextFunction
   ) {
      try {
         const post = await PostController.findPostById(
            req.params.postId,
            next
         );
         if (!post) {
            return;
         }
         await post.remove();
         res.sendStatus(200);
      } catch (err: any) {
         next(err);
      }
   }

   public static async parseFormData(
      req: TypedRequestBody<{ data: any; image: string }>,
      res: Res,
      next: NextFunction
   ) {
      try {
         if (!req.body.data) return next();

         const parsedBody = { ...JSON.parse(req.body.data) };
         if (req.body.image) {
            parsedBody['image'] = req.body.image;
         }

         req.body = parsedBody;
         next();
      } catch (err: any) {
         next(err);
      }
   }

   private static async findPostById(postId: string, next: NextFunction) {
      const post = await PostService.findById(postId);
      if (!post) {
         next(new AppError(404, 'Post with that ID not found'));
         return null;
      }
      return post;
   }
}
