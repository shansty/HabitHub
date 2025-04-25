import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitMigration1745491006946 implements MigrationInterface {
    name = 'InitMigration1745491006946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "habit_event" RENAME COLUMN "attemp" TO "habitAttempt"`
        )
        await queryRunner.query(
            `ALTER TABLE "habit_occurrence" RENAME COLUMN "attemp" TO "habitAttempt"`
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "habit_occurrence" RENAME COLUMN "habitAttempt" TO "attemp"`
        )
        await queryRunner.query(
            `ALTER TABLE "habit_event" RENAME COLUMN "habitAttempt" TO "attemp"`
        )
    }
}
