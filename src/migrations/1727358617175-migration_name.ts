import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1727358617175 implements MigrationInterface {
    name = 'MigrationName1727358617175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_39873ca558965503fff41dc89c\` ON \`location\``);
        await queryRunner.query(`DROP INDEX \`IDX_bfa6a0611abf2ef9ee47197d98\` ON \`food\``);
        await queryRunner.query(`ALTER TABLE \`location\` DROP COLUMN \`coordinates\``);
        await queryRunner.query(`ALTER TABLE \`food\` DROP COLUMN \`coordinates\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`food\` ADD \`coordinates\` point NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`location\` ADD \`coordinates\` point NOT NULL`);
        await queryRunner.query(`CREATE SPATIAL INDEX \`IDX_bfa6a0611abf2ef9ee47197d98\` ON \`food\` (\`coordinates\`)`);
        await queryRunner.query(`CREATE SPATIAL INDEX \`IDX_39873ca558965503fff41dc89c\` ON \`location\` (\`coordinates\`)`);
    }

}
