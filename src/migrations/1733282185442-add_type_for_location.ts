import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeForLocation1733282185442 implements MigrationInterface {
  name = 'AddTypeForLocation1733282185442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`FK_c2b63dbaa3cfe8fed6d4ce54620\` ON \`travel_blog\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`location\` ADD \`type\` varchar(255) NOT NULL DEFAULT 'LOCATION'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`location\` DROP COLUMN \`type\``);
    await queryRunner.query(
      `CREATE INDEX \`FK_c2b63dbaa3cfe8fed6d4ce54620\` ON \`travel_blog\` (\`userId\`)`,
    );
  }
}
