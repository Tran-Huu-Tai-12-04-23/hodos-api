import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeBooleanIsPreium1751427209868 implements MigrationInterface {
    name = 'ChangeBooleanIsPreium1751427209868'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "isPremium" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "isPremium"`);
    }

}
