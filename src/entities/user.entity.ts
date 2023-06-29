import { Entity, Column, Index, BeforeInsert, OneToMany } from 'typeorm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import BaseEntity from './base.entity';
import { Post } from './post.entity';

export enum RoleUser {
   USER = 'user',
   ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseEntity {
   @Column()
   name: string;

   @Index('email_index')
   @Column({
      unique: true,
   })
   email: string;

   @Column()
   password: string;

   @Column({
      type: 'enum',
      enum: RoleUser,
      default: RoleUser.USER,
   })
   role: RoleUser.USER;

   @Column({
      default: 'default.png',
   })
   photo: string;

   @Column({
      default: false,
   })
   verified: boolean;

   @Index('verificationCode_index')
   @Column({
      type: 'text',
      nullable: true,
   })
   verificationCode!: string | null;

   @OneToMany(() => Post, post => post.user)
   posts: Post[];

   @BeforeInsert()
   async hashPassword() {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
   }

   static async comparePasswords(
      candidatePassword: string,
      hashedPassword: string
   ) {
      return await bcrypt.compare(candidatePassword, hashedPassword);
   }

   static createVerificationCode() {
      const verificationCode = crypto.randomBytes(32).toString('hex');
      const hashedVerificationCode = crypto
         .createHash('sha256')
         .update(verificationCode)
         .digest('hex');

      return { verificationCode, hashedVerificationCode };
   }

   toJSON() {
      return { ...this, password: undefined, verificationCode: undefined };
   }
}
