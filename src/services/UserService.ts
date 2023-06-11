import { DeepPartial } from 'typeorm';
import { User } from '../entities';
import { redisClient, AppDataSource, signJwt, getConfig } from '../utils';

export class UserService {
   private static readonly userRepository = AppDataSource.getRepository(User);

   /**
    * Create a new user.
    * @param payload - The user data.
    * @returns The created user.
    */
   public static async create(payload: DeepPartial<User>): Promise<User> {
      const create = this.userRepository.create(payload);
      return this.userRepository.save(create);
   }

   /**
    * Find a user by ID.
    * @param id - The user ID.
    * @returns The found user or null if not found.
    */
   public static async findById(id: User['id']): Promise<User | null> {
      return this.userRepository.findOneBy({ id });
   }

   /**
    * Find a user by email.
    * @param email - The user email.
    * @returns The found user or null if not found.
    */
   public static async findByEmail(email: User['email']): Promise<User | null> {
      return this.userRepository.findOneBy({ email });
   }

   /**
    * Find a user based on a query.
    * @param query - The query object.
    * @returns The found user or null if not found.
    */
   public static async find(query: object): Promise<User | null> {
      return this.userRepository.findOneBy(query);
   }

   /**
    * Sign tokens for a user.
    * @param user - The user object.
    * @returns The signed access and refresh tokens.
    */
   public static async signTokens(user: User) {
      // 1. Create Session
      redisClient.set(user.id, JSON.stringify(user), {
         EX: getConfig<number>('redisCacheExpiresIn') * 60,
      });

      // 2. Create Access and Refresh tokens
      const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
         expiresIn: `${getConfig<number>('accessTokenExpiresIn')}m`,
      });

      const refresh_token = signJwt(
         { sub: user.id },
         'refreshTokenPrivateKey',
         {
            expiresIn: `${getConfig<number>('refreshTokenExpiresIn')}m`,
         }
      );

      return { access_token, refresh_token };
   }
}
