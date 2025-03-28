import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1743123595290 implements MigrationInterface {
  name = 'Init1743123595290';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`travel_blog\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`thumbnail\` varchar(255) NOT NULL, \`imgs\` varchar(255) NOT NULL, \`tag\` varchar(255) NULL, \`content\` text NOT NULL, \`userId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Users\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`username\` varchar(500) NOT NULL, \`email\` varchar(500) NOT NULL, \`password\` varchar(500) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`verifyAt\` datetime NOT NULL, \`isActive\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`UserDetails\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`fullName\` varchar(500) NOT NULL, \`address\` varchar(500) NOT NULL, \`phoneNumber\` varchar(500) NOT NULL, \`email\` varchar(500) NOT NULL, \`githubLink\` varchar(500) NOT NULL, \`telegramLink\` varchar(500) NOT NULL, \`facebookLink\` varchar(500) NOT NULL, \`bio\` varchar(500) NOT NULL, \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_e60e37fdce8f5e2b289b621433\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`location\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`name\` varchar(255) NOT NULL, \`address\` varchar(255) NULL, \`description\` text NULL, \`label\` varchar(255) NOT NULL, \`lstImgs\` text NOT NULL, \`coordinates\` text NOT NULL, \`type\` varchar(255) NOT NULL DEFAULT 'LOCATION', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`build_log\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`message\` varchar(255) NOT NULL, \`githubBuildLink\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`errorLogs\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`project\` varchar(250) NOT NULL, \`source\` varchar(250) NOT NULL, \`environments\` varchar(250) NULL, \`statusCode\` varchar(250) NULL, \`timestamp\` varchar(250) NULL, \`path\` varchar(250) NULL, \`name\` varchar(250) NULL, \`error\` text NULL, \`request\` text NULL, \`message\` text NULL, \`isFixed\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`blog\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`thumbnail\` varchar(255) NOT NULL, \`tag\` varchar(255) NULL, \`content\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`UserDetails\` ADD CONSTRAINT \`FK_e60e37fdce8f5e2b289b621433f\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`UserDetails\` DROP FOREIGN KEY \`FK_e60e37fdce8f5e2b289b621433f\``,
    );
    await queryRunner.query(`DROP TABLE \`blog\``);
    await queryRunner.query(`DROP TABLE \`errorLogs\``);
    await queryRunner.query(`DROP TABLE \`build_log\``);
    await queryRunner.query(`DROP TABLE \`location\``);
    await queryRunner.query(
      `DROP INDEX \`REL_e60e37fdce8f5e2b289b621433\` ON \`UserDetails\``,
    );
    await queryRunner.query(`DROP TABLE \`UserDetails\``);
    await queryRunner.query(`DROP TABLE \`Users\``);
    await queryRunner.query(`DROP TABLE \`travel_blog\``);
  }
}
