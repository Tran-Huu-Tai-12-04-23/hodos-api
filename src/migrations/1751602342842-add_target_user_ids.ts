import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTargetUserIds1751602342842 implements MigrationInterface {
  name = 'AddTargetUserIds1751602342842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "targetUserIds" uuid array`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD "isAllUser" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "isAllUser"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP COLUMN "targetUserIds"`,
    );
  }
}
