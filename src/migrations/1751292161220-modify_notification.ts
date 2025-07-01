import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyNotification1751292161220 implements MigrationInterface {
  name = 'ModifyNotification1751292161220';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_270bb7ce69d16550cbc8a3d8dbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "scheduledNotificationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_270bb7ce69d16550cbc8a3d8dbf" FOREIGN KEY ("scheduledNotificationId") REFERENCES "scheduled_notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_270bb7ce69d16550cbc8a3d8dbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "scheduledNotificationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_270bb7ce69d16550cbc8a3d8dbf" FOREIGN KEY ("scheduledNotificationId") REFERENCES "scheduled_notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
