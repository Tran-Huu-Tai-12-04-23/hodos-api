import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLog1752816272140 implements MigrationInterface {
  name = 'AddLog1752816272140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "action_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "action" character varying NOT NULL, "entityName" character varying NOT NULL, "metadata" jsonb, "performedBy" character varying, "ip" character varying, CONSTRAINT "PK_63cffa5d8af90621882f0388359" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "action_log"`);
  }
}
