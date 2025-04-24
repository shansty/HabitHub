import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1745503639484 implements MigrationInterface {
    name = 'InitMigration1745503639484'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" ADD "attemptStartDate" date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" DROP COLUMN "attemptStartDate"`);
    }

}
