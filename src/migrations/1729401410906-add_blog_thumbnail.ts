import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogThumbnail1729401410906 implements MigrationInterface {
  name = 'AddBlogThumbnail1729401410906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`blog\` ADD \`thumbnail\` varchar(255) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`blog\` DROP COLUMN \`thumbnail\``);
  }
}
