import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCoordinates1728806713681 implements MigrationInterface {
  name = 'AddCoordinates1728806713681';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD \`coordinates\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`food\` ADD \`coordinates\` text NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`food\` DROP COLUMN \`coordinates\``);
    await queryRunner.query(
      `ALTER TABLE \`location\` DROP COLUMN \`coordinates\``,
    );
  }
}
