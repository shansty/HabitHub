import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1745315098212 implements MigrationInterface {
    name = 'InitMigration1745315098212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" RENAME COLUMN "title" TO "name"`);
        await queryRunner.query(`ALTER TABLE "habit" ADD "isCompleted" boolean NOT NULL DEFAULT false`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" DROP COLUMN "isCompleted"`);
        await queryRunner.query(`ALTER TABLE "habit" RENAME COLUMN "name" TO "title"`);

    }

}
