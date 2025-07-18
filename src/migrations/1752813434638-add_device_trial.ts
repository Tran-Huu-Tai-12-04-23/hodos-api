import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceTrial1752813434638 implements MigrationInterface {
  name = 'AddDeviceTrial1752813434638';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "device_trials" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "userId" uuid, "deviceId" character varying NOT NULL, "deviceName" character varying(255), "deviceModel" character varying, "deviceType" character varying, "trialUsageCount" integer NOT NULL DEFAULT '0', "maxTrialCount" integer NOT NULL DEFAULT '3', CONSTRAINT "PK_5014fc53f31ab9ec3186d1031b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_trials" ADD CONSTRAINT "FK_bec2332fe90b4ac7c3f0ab7e04a" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device_trials" DROP CONSTRAINT "FK_bec2332fe90b4ac7c3f0ab7e04a"`,
    );
    await queryRunner.query(`DROP TABLE "device_trials"`);
  }
}
