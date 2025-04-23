import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1745390698293 implements MigrationInterface {
    name = 'InitMigration1745390698293'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" ADD "progress" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" DROP COLUMN "progress"`);
    }

}
