import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTripDict1747148327450 implements MigrationInterface {
    name = 'AddTripDict1747148327450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`trip_direction\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`tripId\` varchar(36) NOT NULL, \`distance\` float NOT NULL, \`duration\` float NOT NULL, \`geometry\` text NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`trip\` ADD \`tripDirectionId\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`trip\` DROP COLUMN \`tripDirectionId\``);
        await queryRunner.query(`DROP TABLE \`trip_direction\``);
    }

}
