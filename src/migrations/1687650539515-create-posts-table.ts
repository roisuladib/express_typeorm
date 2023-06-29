import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePostsTable1687650539515 implements MigrationInterface {
   name = 'CreatePostsTable1687650539515';

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE "posts" (
         "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
         "created_at" TIMESTAMP NOT NULL DEFAULT now(),
         "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
         "title" character varying NOT NULL,
         "content" character varying NOT NULL,
         "image" character varying NOT NULL DEFAULT 'default-post.png',
         "userId" uuid,
         CONSTRAINT "UQ_2d82eb2bb2ddd7a6bfac8804d8a" UNIQUE ("title"),
         CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
      await queryRunner.query(
         `ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
      );
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`
      );
      await queryRunner.query(`DROP TABLE "posts"`);
   }
}
