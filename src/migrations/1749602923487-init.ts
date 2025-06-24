import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1749602923487 implements MigrationInterface {
    name = 'Init1749602923487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."notifications_type_enum" RENAME TO "notifications_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type" AS ENUM('info', 'reminder', 'alert', 'recommendation', 'trip_update', 'new_content')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notification_type" USING "type"::"text"::"public"."notification_type"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."scheduled_notifications_notificationtype_enum" RENAME TO "scheduled_notifications_notificationtype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_type" AS ENUM('info', 'reminder', 'alert', 'recommendation', 'trip_update', 'new_content')`);
        await queryRunner.query(`ALTER TABLE "scheduled_notifications" ALTER COLUMN "notificationType" TYPE "public"."notification_type" USING "notificationType"::"text"::"public"."notification_type"`);
        await queryRunner.query(`DROP TYPE "public"."scheduled_notifications_notificationtype_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."scheduled_notifications_channels_enum" RENAME TO "scheduled_notifications_channels_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_channel" AS ENUM('in_app', 'email', 'push')`);
        await queryRunner.query(`ALTER TABLE "scheduled_notifications" ALTER COLUMN "channels" TYPE "public"."notification_channel"[] USING "channels"::"text"::"public"."notification_channel"[]`);
        await queryRunner.query(`DROP TYPE "public"."scheduled_notifications_channels_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."scheduled_notifications_channels_enum_old" AS ENUM('in_app', 'email', 'push')`);
        await queryRunner.query(`ALTER TABLE "scheduled_notifications" ALTER COLUMN "channels" TYPE "public"."scheduled_notifications_channels_enum_old"[] USING "channels"::"text"::"public"."scheduled_notifications_channels_enum_old"[]`);
        await queryRunner.query(`DROP TYPE "public"."notification_channel"`);
        await queryRunner.query(`ALTER TYPE "public"."scheduled_notifications_channels_enum_old" RENAME TO "scheduled_notifications_channels_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."scheduled_notifications_notificationtype_enum_old" AS ENUM('info', 'reminder', 'alert', 'recommendation', 'trip_update', 'new_content')`);
        await queryRunner.query(`ALTER TABLE "scheduled_notifications" ALTER COLUMN "notificationType" TYPE "public"."scheduled_notifications_notificationtype_enum_old" USING "notificationType"::"text"::"public"."scheduled_notifications_notificationtype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type"`);
        await queryRunner.query(`ALTER TYPE "public"."scheduled_notifications_notificationtype_enum_old" RENAME TO "scheduled_notifications_notificationtype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum_old" AS ENUM('info', 'reminder', 'alert', 'recommendation', 'trip_update', 'new_content')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "public"."notifications_type_enum_old" USING "type"::"text"::"public"."notifications_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notification_type"`);
        await queryRunner.query(`ALTER TYPE "public"."notifications_type_enum_old" RENAME TO "notifications_type_enum"`);
    }

}
