import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHistoryToScheduleNotification1751601823408 implements MigrationInterface {
    name = 'AddHistoryToScheduleNotification1751601823408'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduled_notifications" ADD "history" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scheduled_notifications" DROP COLUMN "history"`);
    }

}
