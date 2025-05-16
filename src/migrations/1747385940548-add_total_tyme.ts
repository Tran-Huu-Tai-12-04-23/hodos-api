import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTotalTyme1747385940548 implements MigrationInterface {
    name = 'AddTotalTyme1747385940548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`timePosted\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`commentCount\` int NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`commentCount\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`timePosted\``);
    }

}
