import { MigrationInterface, QueryRunner } from "typeorm";

export class ExperienceStatusEnum1790848111104 implements MigrationInterface {
    name = 'ExperienceStatusEnum1790848111104'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."experiences_status_enum" AS ENUM('Terminée', 'En cours')`);
        await queryRunner.query(`ALTER TABLE "experiences" ALTER COLUMN "status" TYPE "public"."experiences_status_enum" USING "status"::"public"."experiences_status_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experiences" ALTER COLUMN "status" TYPE character varying USING "status"::character varying`);
        await queryRunner.query(`DROP TYPE "public"."experiences_status_enum"`);
    }

}
