import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTrialUserSub1750983726744 implements MigrationInterface {
  name = 'AddTrialUserSub1750983726744';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" ADD "isTrial" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" ADD "trialEndsAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP COLUMN "trialEndsAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_subscriptions" DROP COLUMN "isTrial"`,
    );
  }
}
