import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusForPost1752028562214 implements MigrationInterface {
  name = 'AddStatusForPost1752028562214';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."post_status_enum" AS ENUM('publish', 'pending', 'rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "post" ADD "status" "public"."post_status_enum" NOT NULL DEFAULT 'publish'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."post_status_enum"`);
  }
}
