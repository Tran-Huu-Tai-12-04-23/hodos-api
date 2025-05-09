import { MigrationInterface, QueryRunner } from 'typeorm';

export class RmEntityPlan1746772689311 implements MigrationInterface {
  name = 'RmEntityPlan1746772689311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`trip_activity\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`timeStart\` varchar(255) NOT NULL, \`timeEnd\` varchar(255) NOT NULL, \`locationId\` varchar(255) NOT NULL, \`tripDayId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`trip_day\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`dayNumber\` int NOT NULL, \`date\` varchar(255) NOT NULL, \`dayOfWeek\` varchar(255) NOT NULL, \`tripId\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`trip\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`type\` varchar(255) NOT NULL DEFAULT 'SYSTEM', \`totalDays\` int NOT NULL, \`typeTrip\` varchar(255) NOT NULL, \`startDate\` varchar(255) NOT NULL, \`endDate\` varchar(255) NOT NULL, \`budget\` varchar(255) NOT NULL, \`favorites\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`trip_user\` (\`id\` varchar(36) NOT NULL, \`tripId\` varchar(36) NOT NULL, \`userId\` varchar(36) NOT NULL, \`isOwner\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`trip_activity\` ADD CONSTRAINT \`FK_4f2ffeb2742baf14d60598ed8e1\` FOREIGN KEY (\`tripDayId\`) REFERENCES \`trip_day\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`trip_day\` ADD CONSTRAINT \`FK_05d58a8db071da8935693f43f50\` FOREIGN KEY (\`tripId\`) REFERENCES \`trip\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`trip_user\` ADD CONSTRAINT \`FK_5da99531021fece574e1e293c73\` FOREIGN KEY (\`tripId\`) REFERENCES \`trip\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`trip_user\` ADD CONSTRAINT \`FK_fda6a69770711db41507f1dd9b2\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`trip_user\` DROP FOREIGN KEY \`FK_fda6a69770711db41507f1dd9b2\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`trip_user\` DROP FOREIGN KEY \`FK_5da99531021fece574e1e293c73\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`trip_day\` DROP FOREIGN KEY \`FK_05d58a8db071da8935693f43f50\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`trip_activity\` DROP FOREIGN KEY \`FK_4f2ffeb2742baf14d60598ed8e1\``,
    );
    await queryRunner.query(`DROP TABLE \`trip_user\``);
    await queryRunner.query(`DROP TABLE \`trip\``);
    await queryRunner.query(`DROP TABLE \`trip_day\``);
    await queryRunner.query(`DROP TABLE \`trip_activity\``);
  }
}
