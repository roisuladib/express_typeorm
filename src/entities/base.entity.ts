import {
   BaseEntity,
   CreateDateColumn,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';

export default abstract class Base extends BaseEntity {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;
}
