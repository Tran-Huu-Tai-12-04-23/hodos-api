import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTypeThumbnail1747382433198 implements MigrationInterface {
  name = 'ChangeTypeThumbnail1747382433198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`thumbnail\``);
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`thumbnail\` text NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`imgs\``);
    await queryRunner.query(`ALTER TABLE \`post\` ADD \`imgs\` text NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`imgs\``);
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`imgs\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`thumbnail\``);
    await queryRunner.query(
      `ALTER TABLE \`post\` ADD \`thumbnail\` varchar(255) NOT NULL`,
    );
  }
}
