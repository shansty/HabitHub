import { MigrationInterface, QueryRunner } from 'typeorm'

export class InitMigration1745490880592 implements MigrationInterface {
    name = 'InitMigration1745490880592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "habit_event" ADD "attemp" integer NOT NULL DEFAULT '1'`
        )
        await queryRunner.query(
            `ALTER TABLE "habit_occurrence" ADD "attemp" integer NOT NULL DEFAULT '1'`
        )
        await queryRunner.query(
            `ALTER TYPE "public"."habit_status_enum" RENAME TO "habit_status_enum_old"`
        )
        await queryRunner.query(
            `CREATE TYPE "public"."habit_status_enum" AS ENUM('IN_PROGRESS', 'COMPLETED', 'ABANDONED')`
        )
        await queryRunner.query(
            `ALTER TABLE "habit" ALTER COLUMN "status" DROP DEFAULT`
        )
        await queryRunner.query(
            `ALTER TABLE "habit" ALTER COLUMN "status" TYPE "public"."habit_status_enum" USING "status"::"text"::"public"."habit_status_enum"`
        )
        await queryRunner.query(
            `ALTER TABLE "habit" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS'`
        )
        await queryRunner.query(`DROP TYPE "public"."habit_status_enum_old"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."habit_status_enum_old" AS ENUM('IN_PROGRESS', 'COMPLETED', 'PAUSED', 'ABANDONED')`
        )
        await queryRunner.query(
            `ALTER TABLE "habit" ALTER COLUMN "status" DROP DEFAULT`
        )
        await queryRunner.query(
            `ALTER TABLE "habit" ALTER COLUMN "status" TYPE "public"."habit_status_enum_old" USING "status"::"text"::"public"."habit_status_enum_old"`
        )
        await queryRunner.query(
            `ALTER TABLE "habit" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS'`
        )
        await queryRunner.query(`DROP TYPE "public"."habit_status_enum"`)
        await queryRunner.query(
            `ALTER TYPE "public"."habit_status_enum_old" RENAME TO "habit_status_enum"`
        )
        await queryRunner.query(
            `ALTER TABLE "habit_occurrence" DROP COLUMN "attemp"`
        )
        await queryRunner.query(
            `ALTER TABLE "habit_event" DROP COLUMN "attemp"`
        )
    }
}
