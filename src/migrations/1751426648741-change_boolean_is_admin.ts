import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeBooleanIsAdmin1751426648741 implements MigrationInterface {
  name = 'ChangeBooleanIsAdmin1751426648741';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "isAdmin"`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "isAdmin" boolean`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "isAdmin"`);
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "isAdmin" character varying`,
    );
  }
}
