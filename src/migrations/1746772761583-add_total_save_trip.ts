import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTotalSaveTrip1746772761583 implements MigrationInterface {
  name = 'AddTotalSaveTrip1746772761583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`trip\` ADD \`totalSave\` int NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`totalSave\``);
  }
}
