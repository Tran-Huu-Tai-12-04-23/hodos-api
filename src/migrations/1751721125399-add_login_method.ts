import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLoginMethod1751721125399 implements MigrationInterface {
    name = 'AddLoginMethod1751721125399'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "isLoginWithGoogle" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "isLoginWithFacebook" boolean DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "isLoginWithFacebook"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "isLoginWithGoogle"`);
    }

}
