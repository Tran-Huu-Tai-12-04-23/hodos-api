import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVec1757170444366 implements MigrationInterface {
  name = 'AddVec1757170444366';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location" ADD "embedding" double precision array`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "location"."embedding" IS 'Embedding vector for RAG (Retrieval-Augmented Generation)'`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "location" ALTER COLUMN "embedding" TYPE vector(1536) USING embedding::vector;`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `COMMENT ON COLUMN "location"."embedding" IS 'Embedding vector for RAG (Retrieval-Augmented Generation)'`,
    );
    await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "embedding"`);
  }
}
