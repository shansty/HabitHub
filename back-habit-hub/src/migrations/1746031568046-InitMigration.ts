import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1746031568046 implements MigrationInterface {
    name = 'InitMigration1746031568046'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendship" RENAME COLUMN "isAccepted" TO "status"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."friendship_status_enum" AS ENUM('REJECTED', 'PENDING', 'ACCEPTED')`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD "status" "public"."friendship_status_enum" NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendship" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."friendship_status_enum"`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD "status" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "friendship" RENAME COLUMN "status" TO "isAccepted"`);
    }

}
