import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeType1752245153916 implements MigrationInterface {
  name = 'ChangeType1752245153916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."notification_type" RENAME TO "notification_type_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type" AS ENUM('info', 'reminder', 'alert', 'recommendation', 'trip_update', 'new_content', 'post_rejected')`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notification_type" USING "type"::text::"public"."notification_type"`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ALTER COLUMN "notificationType" TYPE "public"."notification_type" USING "notificationType"::text::"public"."notification_type"`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_type_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_old" AS ENUM('info', 'reminder', 'alert', 'recommendation', 'trip_update', 'new_content')`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ALTER COLUMN "notificationType" TYPE "public"."notification_type_old" USING "notificationType"::text::"public"."notification_type_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notification_type_old" USING "type"::text::"public"."notification_type_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_type"`);
    await queryRunner.query(
      `ALTER TYPE "public"."notification_type_old" RENAME TO "notification_type"`,
    );
  }
}
