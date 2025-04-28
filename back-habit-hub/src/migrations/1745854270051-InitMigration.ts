import { MigrationInterface, QueryRunner } from "typeorm";

export class InitMigration1745854270051 implements MigrationInterface {
    name = 'InitMigration1745854270051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "friendship" ("id" SERIAL NOT NULL, "isAccepted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user1Id" integer, "user2Id" integer, CONSTRAINT "UQ_4f31989946167a1964ae8c328ed" UNIQUE ("user1Id", "user2Id"), CONSTRAINT "PK_dbd6fb568cd912c5140307075cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_19d92a79d938f4f61a27ca93dfb" FOREIGN KEY ("user1Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "friendship" ADD CONSTRAINT "FK_67e0cc82733694bb847a90ce723" FOREIGN KEY ("user2Id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_67e0cc82733694bb847a90ce723"`);
        await queryRunner.query(`ALTER TABLE "friendship" DROP CONSTRAINT "FK_19d92a79d938f4f61a27ca93dfb"`);
        await queryRunner.query(`DROP TABLE "friendship"`);
    }

}
