import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRejectPost1752244183217 implements MigrationInterface {
  name = 'AddRejectPost1752244183217';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_rejection" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "createdBy" character varying, "createdByName" character varying(50), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleteBy" character varying, "isDeleted" boolean NOT NULL DEFAULT false, "reason" character varying(255) NOT NULL, "details" text, "adminId" uuid NOT NULL, "postId" uuid NOT NULL, "rejectedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_976502406aa95e5681ea2a38ab2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_rejection" ADD CONSTRAINT "FK_e3ccaae8c120a31151748bb9d9d" FOREIGN KEY ("adminId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_rejection" ADD CONSTRAINT "FK_a17185fe01b3654ffd668ee4818" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post_rejection" DROP CONSTRAINT "FK_a17185fe01b3654ffd668ee4818"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_rejection" DROP CONSTRAINT "FK_e3ccaae8c120a31151748bb9d9d"`,
    );
    await queryRunner.query(`DROP TABLE "post_rejection"`);
  }
}
