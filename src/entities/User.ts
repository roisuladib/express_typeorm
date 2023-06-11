import { Entity, Column, Index, BeforeInsert } from 'typeorm';
import bcrypt from 'bcryptjs';
import Model from './Model';

export enum RoleEnumType {
   ADMIN = 'admin',
   USER = 'user',
}

@Entity('users')
export class User extends Model {
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
      enum: RoleEnumType,
      default: RoleEnumType.USER,
   })
   role: RoleEnumType.USER;

   @Column({
      default: 'default.png',
   })
   photo: string;

   @Column({
      default: false,
   })
   verified: boolean;

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

   toJSON() {
      return { ...this, password: undefined, verified: undefined };
   }
}
