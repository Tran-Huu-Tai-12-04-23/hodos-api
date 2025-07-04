import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveRelationNotification1751612079583
  implements MigrationInterface
{
  name = 'RemoveRelationNotification1751612079583';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_270bb7ce69d16550cbc8a3d8dbf"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_270bb7ce69d16550cbc8a3d8dbf" FOREIGN KEY ("scheduledNotificationId") REFERENCES "scheduled_notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
