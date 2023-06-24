import { AppDataSource, paginateResponse } from '../utils';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities';
import { Like } from 'typeorm';

export class UserController {
   private static readonly userRepository = AppDataSource.getRepository(User);

   /**
    * Get all users.
    * @param req - The request object.
    * @param res - The response object.
    * @param next - The next middleware function.
    * @returns A promise that resolves to an array of users and the total count.
    */
   public static async all(
      req: Request<
         {},
         {},
         {},
         {
            name: string;
            page: number;
            limit: number;
         }
      >,
      res: Response,
      next: NextFunction
   ) {
      const name = req.query.name || '';
      const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
      const skip = (page - 1) * limit;

      const data = await UserController.userRepository.findAndCount({
         where: {
            name: Like('%' + name + '%'),
         },
         skip,
         take: limit,
      });

      res.json(paginateResponse(data, page, limit));
   }

   /**
    * Get a specific user by ID.
    * @param req - The request object.
    * @param res - The response object.
    * @param next - The next middleware function.
    * @returns The found user or an error message if not found.
    */
   public static async one(req: Request, res: Response, next: NextFunction) {
      const id = req.params.id;

      const user = await UserController.userRepository.findOne({
         where: { id },
      });

      if (!user) {
         return 'unregistered user';
      }
      return user;
   }

   /**
    * Get the current logged-in user.
    * @param req - The request object.
    * @param res - The response object.
    * @param next - The next middleware function.
    */
   public static async me(req: Request, res: Response, next: NextFunction) {
      try {
         const user = res.locals.user;
         res.json({
            status: 'success',
            data: { user },
         });
      } catch (err: any) {
         next(err);
      }
   }

   /**
    * Save a new user.
    * @param req - The request object.
    * @param res - The response object.
    * @param next - The next middleware function.
    * @returns The saved user.
    */
   public static async save(req: Request, res: Response, next: NextFunction) {
      const { firstName, lastName, age } = req.body;

      const user = Object.assign(new User(), {
         firstName,
         lastName,
         age,
      });

      return UserController.userRepository.save(user);
   }

   /**
    * Remove a user by ID.
    * @param req - The request object.
    * @param res - The response object.
    * @param next - The next middleware function.
    * @returns A success message if the user is removed, or an error message if the user doesn't exist.
    */
   public static async remove(req: Request, res: Response, next: NextFunction) {
      const id = req.params.id;

      const userToRemove = await UserController.userRepository.findOneBy({
         id,
      });

      if (!userToRemove) {
         return 'this user not exist';
      }

      await UserController.userRepository.remove(userToRemove);

      return 'user has been removed';
   }
}
