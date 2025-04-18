import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1744985293835 implements MigrationInterface {
    name = 'InitMigration1744985293835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" RENAME COLUMN "name" TO "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" RENAME COLUMN "title" TO "name"`);
    }

}
