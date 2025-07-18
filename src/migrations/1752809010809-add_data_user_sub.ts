import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDataUserSub1752809010809 implements MigrationInterface {
    name = 'AddDataUserSub1752809010809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "totalPlanTripInMonth" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "subscriptions" jsonb`);
        await queryRunner.query(`ALTER TABLE "user_devices" DROP CONSTRAINT "FK_e12ac4f8016243ac71fd2e415af"`);
        await queryRunner.query(`ALTER TABLE "user_devices" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_devices" ADD CONSTRAINT "FK_e12ac4f8016243ac71fd2e415af" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_devices" DROP CONSTRAINT "FK_e12ac4f8016243ac71fd2e415af"`);
        await queryRunner.query(`ALTER TABLE "user_devices" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_devices" ADD CONSTRAINT "FK_e12ac4f8016243ac71fd2e415af" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "subscriptions"`);
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "totalPlanTripInMonth"`);
    }

}
