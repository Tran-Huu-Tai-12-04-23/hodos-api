import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddErrorLog1734857553636 implements MigrationInterface {
  name = 'AddErrorLog1734857553636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`errorLogs\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`project\` varchar(250) NOT NULL, \`source\` varchar(250) NOT NULL, \`environments\` varchar(250) NULL, \`statusCode\` varchar(250) NULL, \`timestamp\` varchar(250) NULL, \`path\` varchar(250) NULL, \`name\` varchar(250) NULL, \`error\` text NULL, \`request\` text NULL, \`message\` text NULL, \`isFixed\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`errorLogs\``);
  }
}
