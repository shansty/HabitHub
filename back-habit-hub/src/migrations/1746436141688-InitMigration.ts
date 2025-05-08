import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1746436141688 implements MigrationInterface {
    name = 'InitMigration1746436141688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" ADD "penalizedFailedDays" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" DROP COLUMN "penalizedFailedDays"`);
    }

}
