import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogEnti1729377796208 implements MigrationInterface {
  name = 'AddBlogEnti1729377796208';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`blog\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`tag\` varchar(255) NULL, \`content\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`blog\``);
  }
}
