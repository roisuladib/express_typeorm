import { object, string, TypeOf, z } from 'zod';
import { RoleUser } from '../entities';

export const registerSchema = object({
   body: object({
      name: string({
         required_error: 'Name is required',
      }),
      email: string({
         required_error: 'Email address is required',
      }).email('Invalid email address'),
      password: string({
         required_error: 'Password is required',
      })
         .min(8, 'Password must be more than 8 characters')
         .max(32, 'Password must be less than 32 characters')
         .regex(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[\d])(?=.*?[^\sa-zA-Z0-9]).{8,}$/,
            'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
         ),
      passwordConfirm: string({
         required_error: 'Please confirm your password',
      }),
      role: z.optional(z.nativeEnum(RoleUser)),
   }).refine(data => data.password === data.passwordConfirm, {
      path: ['passwordConfirm'],
      message: 'Password do not match',
   }),
});

export const verifyEmailSchema = object({
   params: object({
      verificationCode: string(),
   }),
});

export const loginSchema = object({
   body: object({
      email: string({
         required_error: 'Email address is required',
      }).email('Invalid email address'),
      password: string({
         required_error: 'Password is required',
      }).min(8, 'Invalid password'),
   }),
});

export type RegisterSchema = Omit<
   TypeOf<typeof registerSchema>['body'],
   'passwordConfirm'
>;

export type LoginSchema = TypeOf<typeof loginSchema>['body'];

export type VerifyEmailSchema = TypeOf<typeof verifyEmailSchema>['params'];
