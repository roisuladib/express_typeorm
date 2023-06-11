import { AppDataSource } from '../utils';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entities';

export class UserController {
   private static readonly userRepository = AppDataSource.getRepository(User);

   /**
    * Get all users.
    * @param req - The request object.
    * @param res - The response object.
    * @param next - The next middleware function.
    * @returns A promise that resolves to an array of users and the total count.
    */
   public static async all(req: Request, res: Response, next: NextFunction) {
      const page = req.query.page ? parseInt(req.query.page.toString()) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;

      const skip = (page - 1) * limit;
      return this.userRepository.findAndCount({
         skip: skip,
         take: limit,
      });
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

      const user = await this.userRepository.findOne({
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

      return this.userRepository.save(user);
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

      let userToRemove = await this.userRepository.findOneBy({ id });

      if (!userToRemove) {
         return 'this user not exist';
      }

      await this.userRepository.remove(userToRemove);

      return 'user has been removed';
   }
}
