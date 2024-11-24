import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailToUse1732422985226 implements MigrationInterface {
    name = 'AddEmailToUse1732422985226'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`travel_blog\` DROP FOREIGN KEY \`FK_c2b63dbaa3cfe8fed6d4ce54620\``);
        await queryRunner.query(`ALTER TABLE \`Users\` ADD \`email\` varchar(500) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`Users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`travel_blog\` ADD CONSTRAINT \`FK_c2b63dbaa3cfe8fed6d4ce54620\` FOREIGN KEY (\`userId\`) REFERENCES \`Users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
