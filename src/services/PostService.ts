import {
   FindManyOptions,
   FindOptions,
   FindOptionsRelations,
   FindOptionsSelect,
   FindOptionsWhere,
} from 'typeorm';
import { Post, User } from '../entities';
import { AppDataSource, extractPageLimitParams } from '../utils';

export class PostService {
   private static readonly postRepository = AppDataSource.getRepository(Post);

   public static async index(
      pagination: FindManyOptions<Post> = {},
      where: FindOptionsWhere<Post> = {},
      select: FindOptionsSelect<Post> = {},
      relations: FindOptionsRelations<Post> = {}
   ): Promise<[Post[], number]> {
      const data = await PostService.postRepository.findAndCount({
         skip: pagination.skip,
         take: pagination.take,
         where,
         select,
         relations,
      });

      return data;
   }

   public static async findById(postId: string): Promise<Post | null> {
      return await PostService.postRepository.findOneBy({ id: postId });
   }

   public static async create(
      payload: Partial<Post>,
      user: User
   ): Promise<Post> {
      const create = PostService.postRepository.create({ ...payload, user });
      return await PostService.postRepository.save(create);
   }
}
