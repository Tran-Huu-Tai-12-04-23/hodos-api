import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifyExpiredTime1743336359513 implements MigrationInterface {
    name = 'AddVerifyExpiredTime1743336359513'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`verifyExpiredTime\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`verifyExpiredTime\``);
    }

}
