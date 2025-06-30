import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1751031444479 implements MigrationInterface {
  name = 'Init1751031444479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "title" character varying(255) NOT NULL, "thumbnail" text NOT NULL, "imgs" text NOT NULL, "tag" character varying(255), "content" text NOT NULL, "timePosted" integer NOT NULL DEFAULT '0', "commentCount" integer NOT NULL DEFAULT '0', "userId" character varying(255) NOT NULL, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."location_interactions_interactiontype_enum" AS ENUM('view', 'like', 'unlike', 'share', 'virtual_tour_start', 'virtual_tour_end', 'save_to_trip', 'review', 'check_in')`,
    );
    await queryRunner.query(
      `CREATE TABLE "location_interactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "locationId" uuid NOT NULL, "userId" uuid NOT NULL, "interactionType" "public"."location_interactions_interactiontype_enum" NOT NULL, "metadata" jsonb, CONSTRAINT "PK_dd87fda305939320a9deed0ca67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."location_media_360_mediatype_enum" AS ENUM('image', 'video', 'threesixty_image', 'threesixty_video')`,
    );
    await queryRunner.query(
      `CREATE TABLE "location_media_360" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "locationId" uuid NOT NULL, "mediaType" "public"."location_media_360_mediatype_enum" NOT NULL, "mediaUrl" text NOT NULL, "thumbnailUrl" text, "displayOrder" integer, "caption" text, CONSTRAINT "PK_1047748126c9c58d915a4dc8aa3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(255) NOT NULL, "address" character varying(255), "description" text, "label" character varying(255) NOT NULL, "lstImgs" text NOT NULL, "coordinates" text NOT NULL, "type" character varying NOT NULL DEFAULT 'LOCATION', "detail" text NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trip_activity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "timeStart" character varying NOT NULL, "timeEnd" character varying NOT NULL, "locationId" uuid NOT NULL, "tripDayId" uuid NOT NULL, CONSTRAINT "PK_1f0dcce48f5da2201f933a00761" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trip_day" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "dayNumber" integer NOT NULL, "date" character varying NOT NULL, "dayOfWeek" character varying NOT NULL, "tripId" uuid NOT NULL, CONSTRAINT "PK_22c09bc2360526eb49095589b59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trip" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "type" character varying(255) NOT NULL DEFAULT 'SYSTEM', "thumbnail" text NOT NULL, "totalDays" integer NOT NULL, "typeTrip" character varying NOT NULL, "startDate" character varying NOT NULL, "endDate" character varying NOT NULL, "budget" character varying NOT NULL, "favorites" character varying NOT NULL, "totalSave" integer NOT NULL, "tripDirectionId" character varying(255), CONSTRAINT "PK_714c23d558208081dbccb9d9268" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "trip_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "tripId" uuid NOT NULL, "userId" uuid NOT NULL, "isOwner" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_64c0a95b91a9b4c120a26d54b69" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "username" character varying(500) NOT NULL, "email" character varying(500) NOT NULL, "password" character varying(500) NOT NULL, "avatar" character varying NOT NULL, "verifyAt" TIMESTAMP, "isAdmin" character varying, "verifyCode" character varying, "isActive" boolean NOT NULL, "isUpdateDetail" boolean NOT NULL DEFAULT false, "verifyExpiredTime" TIMESTAMP, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "fullName" character varying NOT NULL, "address" character varying, "phoneNumber" character varying, "email" character varying, "githubLink" character varying, "telegramLink" character varying, "facebookLink" character varying, "bio" text, "profilePictureUrl" character varying, "birthDate" date, "gender" character varying, "nationality" character varying, "travelInterests" text, "travelHistory" text, "languages" character varying, "reputationScore" double precision NOT NULL DEFAULT '0', "userId" uuid NOT NULL, CONSTRAINT "REL_5261d2468b1288b347d58e8b54" UNIQUE ("userId"), CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_data_plan_questions_type_enum" AS ENUM('SINGLE_CHOICE', 'MULTI_CHOICE', 'DATE_RANGE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_data_plan_questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "question" text NOT NULL, "type" "public"."master_data_plan_questions_type_enum" NOT NULL, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_2ecba2d606710787c07cc7bbca5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_data_plan_question_options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "label" character varying(255) NOT NULL, "desc" text, "icon" character varying(10), "value" character varying(100) NOT NULL, "questionId" uuid NOT NULL, CONSTRAINT "PK_1c7f1b8f539b6ee6f527c419445" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."master_data_pricing_plans_billingcycle_enum" AS ENUM('monthly', 'yearly', 'quarterly', 'one_time', 'custom')`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_data_pricing_plans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "name" character varying(100) NOT NULL, "planCode" character varying(100) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL, "billingCycle" "public"."master_data_pricing_plans_billingcycle_enum" NOT NULL, "features" jsonb, "isActive" boolean NOT NULL DEFAULT true, "trialPeriodDays" integer NOT NULL DEFAULT '0', "displayOrder" integer, "limits" jsonb, CONSTRAINT "UQ_cece90177ae3d02b3967278674c" UNIQUE ("name"), CONSTRAINT "UQ_4f1fff6808da9068d68708c2e82" UNIQUE ("planCode"), CONSTRAINT "PK_017923e9dd115f9d8509ee39dae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "master_data_receiving_banks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "bankName" character varying(255) NOT NULL, "bankCode" character varying(20), "accountNumber" character varying(100) NOT NULL, "accountHolderName" character varying(255) NOT NULL, "branchName" character varying(255), "currency" character varying(3) NOT NULL DEFAULT 'VND', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_7c6a3c41d317764454ef9ef8b0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_subscriptions_status_enum" AS ENUM('active', 'cancelled', 'expired', 'pending_payment', 'trialing', 'past_due', 'incomplete')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_subscriptions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "pricingPlanId" uuid NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE NOT NULL, "currentPeriodEndDate" TIMESTAMP WITH TIME ZONE, "cancelledAt" TIMESTAMP WITH TIME ZONE, "status" "public"."user_subscriptions_status_enum" NOT NULL, "autoRenew" boolean NOT NULL DEFAULT true, "lastPaymentDate" TIMESTAMP WITH TIME ZONE, "nextPaymentDate" TIMESTAMP WITH TIME ZONE, "gatewaySubscriptionId" character varying(255), "cancellationReason" text, "isTrial" boolean NOT NULL DEFAULT false, "trialEndsAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_f591ec91237ce1a763f0cce7a5c" UNIQUE ("gatewaySubscriptionId"), CONSTRAINT "PK_9e928b0954e51705ab44988812c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0aa57d309073f214bb5143d4d5" ON "user_subscriptions" ("pricingPlanId", "status") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_565dbec603dc3f8c5b60aeda96" ON "user_subscriptions" ("userId", "status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "trip_direction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "tripId" character varying NOT NULL, "distance" double precision NOT NULL, "duration" double precision NOT NULL, "geometry" text NOT NULL, CONSTRAINT "PK_16833576ebe4652019e0f81fd7c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_type_enum" AS ENUM('subscription_payment')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transactions_status_enum" AS ENUM('pending', 'successful', 'failed', 'cancelled', 'refunded', 'partially_refunded', 'processing')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transactions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "description" text, "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL, "status" "public"."transactions_status_enum" NOT NULL DEFAULT 'pending', "paymentGateway" character varying(50), "gatewayTransactionId" character varying(255), "relatedEntityId" uuid, "relatedEntityType" character varying(100), "metadata" jsonb, "processedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "UQ_32493158820023afb91b9f123ef" UNIQUE ("gatewayTransactionId"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7fe01fe014d3bd495c83808df0" ON "transactions" ("gatewayTransactionId", "paymentGateway") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_57715b5b56fb059bc7f8fb3aa7" ON "transactions" ("userId", "status", "type") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type" AS ENUM('info', 'reminder', 'alert', 'recommendation', 'trip_update', 'new_content')`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid NOT NULL, "scheduledNotificationId" uuid NOT NULL, "title" character varying(255) NOT NULL, "message" text NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "readAt" TIMESTAMP WITH TIME ZONE, "type" "public"."notification_type" NOT NULL, "sentAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "linkTo" character varying(512), "metadata" jsonb, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notification_channel" AS ENUM('in_app', 'email', 'push')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."scheduled_notifications_status_enum" AS ENUM('pending', 'processing', 'sent', 'failed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "scheduled_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid, "title" character varying(255) NOT NULL, "message" text NOT NULL, "notificationType" "public"."notification_type" NOT NULL, "channels" "public"."notification_channel" array NOT NULL, "scheduledTime" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."scheduled_notifications_status_enum" NOT NULL DEFAULT 'pending', "payload" jsonb, "processedAt" TIMESTAMP WITH TIME ZONE, "errorMessage" text, "retryAttempts" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_9eb8b287229934bbd076a5d64f7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_469472c3b4e11d628de99cbfca" ON "scheduled_notifications" ("scheduledTime", "status") `,
    );
    await queryRunner.query(
      `CREATE TABLE "errorLogs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "project" character varying(250) NOT NULL, "source" character varying(250) NOT NULL, "environments" character varying(250), "statusCode" character varying(250), "timestamp" character varying(250), "path" character varying(250), "name" character varying(250), "error" text, "request" text, "message" text, "isFixed" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_5a92efce438d455bc2a5699483c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "build_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "title" character varying(255) NOT NULL, "message" character varying(255) NOT NULL, "githubBuildLink" character varying(255) NOT NULL, CONSTRAINT "PK_32d891e0c4ea5d304f1bff49d45" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "title" character varying(255) NOT NULL, "thumbnail" character varying(255) NOT NULL, "tag" character varying(255), "content" text NOT NULL, CONSTRAINT "PK_85c6532ad065a448e9de7638571" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_interactions" ADD CONSTRAINT "FK_e9e7d46ce67b1fda2bb2349d401" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_interactions" ADD CONSTRAINT "FK_7de7f8e4385fc06eae1b49d9706" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_media_360" ADD CONSTRAINT "FK_c1c696ec48c0108329bc20a3325" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_activity" ADD CONSTRAINT "FK_4a5ee846b79dcf3b6333bbac954" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_activity" ADD CONSTRAINT "FK_4f2ffeb2742baf14d60598ed8e1" FOREIGN KEY ("tripDayId") REFERENCES "trip_day"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_day" ADD CONSTRAINT "FK_05d58a8db071da8935693f43f50" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_user" ADD CONSTRAINT "FK_5da99531021fece574e1e293c73" FOREIGN KEY ("tripId") REFERENCES "trip"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_user" ADD CONSTRAINT "FK_fda6a69770711db41507f1dd9b2" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" ADD CONSTRAINT "FK_5261d2468b1288b347d58e8b540" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_data_plan_question_options" ADD CONSTRAINT "FK_3f17688e8a1ded802745546504d" FOREIGN KEY ("questionId") REFERENCES "master_data_plan_questions"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_2dfab576863bc3f84d4f6962274" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" ADD CONSTRAINT "FK_924e66848c3e67fac51394ab201" FOREIGN KEY ("pricingPlanId") REFERENCES "master_data_pricing_plans"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" ADD CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_692a909ee0fa9383e7859f9b406" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_270bb7ce69d16550cbc8a3d8dbf" FOREIGN KEY ("scheduledNotificationId") REFERENCES "scheduled_notifications"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" ADD CONSTRAINT "FK_01d61e551f8285966b84ca09f49" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "scheduled_notifications" DROP CONSTRAINT "FK_01d61e551f8285966b84ca09f49"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_270bb7ce69d16550cbc8a3d8dbf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_692a909ee0fa9383e7859f9b406"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT "FK_6bb58f2b6e30cb51a6504599f41"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_924e66848c3e67fac51394ab201"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP CONSTRAINT "FK_2dfab576863bc3f84d4f6962274"`,
    );
    await queryRunner.query(
      `ALTER TABLE "master_data_plan_question_options" DROP CONSTRAINT "FK_3f17688e8a1ded802745546504d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_details" DROP CONSTRAINT "FK_5261d2468b1288b347d58e8b540"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_user" DROP CONSTRAINT "FK_fda6a69770711db41507f1dd9b2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_user" DROP CONSTRAINT "FK_5da99531021fece574e1e293c73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_day" DROP CONSTRAINT "FK_05d58a8db071da8935693f43f50"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_activity" DROP CONSTRAINT "FK_4f2ffeb2742baf14d60598ed8e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "trip_activity" DROP CONSTRAINT "FK_4a5ee846b79dcf3b6333bbac954"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_media_360" DROP CONSTRAINT "FK_c1c696ec48c0108329bc20a3325"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_interactions" DROP CONSTRAINT "FK_7de7f8e4385fc06eae1b49d9706"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_interactions" DROP CONSTRAINT "FK_e9e7d46ce67b1fda2bb2349d401"`,
    );
    await queryRunner.query(`DROP TABLE "blog"`);
    await queryRunner.query(`DROP TABLE "build_log"`);
    await queryRunner.query(`DROP TABLE "errorLogs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_469472c3b4e11d628de99cbfca"`,
    );
    await queryRunner.query(`DROP TABLE "scheduled_notifications"`);
    await queryRunner.query(
      `DROP TYPE "public"."scheduled_notifications_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."notification_channel"`);
    await queryRunner.query(`DROP TYPE "public"."notification_type"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notification_type"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_57715b5b56fb059bc7f8fb3aa7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7fe01fe014d3bd495c83808df0"`,
    );
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`);
    await queryRunner.query(`DROP TABLE "trip_direction"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_565dbec603dc3f8c5b60aeda96"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0aa57d309073f214bb5143d4d5"`,
    );
    await queryRunner.query(`DROP TABLE "user_subscriptions"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_subscriptions_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "master_data_receiving_banks"`);
    await queryRunner.query(`DROP TABLE "master_data_pricing_plans"`);
    await queryRunner.query(
      `DROP TYPE "public"."master_data_pricing_plans_billingcycle_enum"`,
    );
    await queryRunner.query(`DROP TABLE "master_data_plan_question_options"`);
    await queryRunner.query(`DROP TABLE "master_data_plan_questions"`);
    await queryRunner.query(
      `DROP TYPE "public"."master_data_plan_questions_type_enum"`,
    );
    await queryRunner.query(`DROP TABLE "user_details"`);
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TABLE "trip_user"`);
    await queryRunner.query(`DROP TABLE "trip"`);
    await queryRunner.query(`DROP TABLE "trip_day"`);
    await queryRunner.query(`DROP TABLE "trip_activity"`);
    await queryRunner.query(`DROP TABLE "location"`);
    await queryRunner.query(`DROP TABLE "location_media_360"`);
    await queryRunner.query(
      `DROP TYPE "public"."location_media_360_mediatype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "location_interactions"`);
    await queryRunner.query(
      `DROP TYPE "public"."location_interactions_interactiontype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "post"`);
  }
}
