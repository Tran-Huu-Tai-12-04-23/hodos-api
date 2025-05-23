import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyUserDetail1747969128837 implements MigrationInterface {
    name = 'ModifyUserDetail1747969128837'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user_details\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdBy\` varchar(36) NULL, \`createdByName\` varchar(50) NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updatedBy\` varchar(36) NULL, \`deleteBy\` varchar(36) NULL, \`isDeleted\` tinyint NOT NULL DEFAULT 0, \`fullName\` varchar(255) NOT NULL, \`address\` varchar(500) NULL, \`phoneNumber\` varchar(50) NULL, \`email\` varchar(255) NULL, \`githubLink\` varchar(500) NULL, \`telegramLink\` varchar(500) NULL, \`facebookLink\` varchar(500) NULL, \`bio\` text NULL, \`profilePictureUrl\` varchar(500) NULL, \`birthDate\` date NULL, \`gender\` varchar(20) NULL, \`nationality\` varchar(100) NULL, \`travelInterests\` text NULL, \`travelHistory\` text NULL, \`languages\` varchar(100) NULL, \`reputationScore\` float NOT NULL DEFAULT '0', \`userId\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_5261d2468b1288b347d58e8b54\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`isUpdateDetail\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`user_details\` ADD CONSTRAINT \`FK_5261d2468b1288b347d58e8b540\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_details\` DROP FOREIGN KEY \`FK_5261d2468b1288b347d58e8b540\``);
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`isUpdateDetail\``);
        await queryRunner.query(`DROP INDEX \`REL_5261d2468b1288b347d58e8b54\` ON \`user_details\``);
        await queryRunner.query(`DROP TABLE \`user_details\``);
    }

}
