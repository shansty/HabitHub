import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitMigration1745318362590 implements MigrationInterface {
    name = 'InitMigration1745318362590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "habit" ADD "isFailed" boolean NOT NULL DEFAULT false`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "habit" DROP COLUMN "isFailed"`)
    }
}
