import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVeriofyCode1743336015797 implements MigrationInterface {
    name = 'AddVeriofyCode1743336015797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`verifyCode\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`verifyAt\` \`verifyAt\` datetime NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` CHANGE \`verifyAt\` \`verifyAt\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`verifyCode\``);
    }

}
