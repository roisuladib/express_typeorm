import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import BaseEntity from './base.entity';
import { User } from './user.entity';

@Entity('posts')
export class Post extends BaseEntity {
   @Column({
      unique: true,
   })
   title: string;

   @Column()
   content: string;

   @Column({
      default: 'default-post.png',
   })
   image: string;

   @ManyToOne(() => User, user => user.posts)
   @JoinColumn()
   user: User;
}
