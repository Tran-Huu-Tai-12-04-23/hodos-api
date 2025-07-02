import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPublish1751437613644 implements MigrationInterface {
    name = 'AddPublish1751437613644'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" ADD "isPublish" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "isPublish"`);
    }

}
