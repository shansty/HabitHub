import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1745331907535 implements MigrationInterface {
    name = 'InitMigration1745331907535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" ADD "attempt" integer NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" DROP COLUMN "attempt"`);
    }

}
