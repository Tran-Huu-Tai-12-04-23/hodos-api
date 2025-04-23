import { MigrationInterface, QueryRunner } from 'typeorm';

export class PlanningTrip1745330477601 implements MigrationInterface {
  name = 'PlanningTrip1745330477601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`planning_location\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`planningId\` varchar(255) NOT NULL, \`locationId\` varchar(255) NOT NULL, \`order\` int NOT NULL, \`estimatedArrival\` timestamp NULL, \`durationMinutes\` int NULL, \`notes\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`planning\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`notes\` text NULL, \`startDate\` timestamp NULL, \`endDate\` timestamp NULL, \`userId\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`planning_location\` ADD CONSTRAINT \`FK_e4a3afede8154d5e6124188eb0b\` FOREIGN KEY (\`planningId\`) REFERENCES \`planning\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`planning_location\` ADD CONSTRAINT \`FK_5c795765ff557f198d4763ae213\` FOREIGN KEY (\`locationId\`) REFERENCES \`location\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`planning\` ADD CONSTRAINT \`FK_da7aae771071b1af9f6041dec50\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`planning\` DROP FOREIGN KEY \`FK_da7aae771071b1af9f6041dec50\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`planning_location\` DROP FOREIGN KEY \`FK_5c795765ff557f198d4763ae213\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`planning_location\` DROP FOREIGN KEY \`FK_e4a3afede8154d5e6124188eb0b\``,
    );
    await queryRunner.query(`DROP TABLE \`planning\``);
    await queryRunner.query(`DROP TABLE \`planning_location\``);
  }
}
