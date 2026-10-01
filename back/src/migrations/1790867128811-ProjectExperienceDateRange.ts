import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectExperienceDateRange1790867128811 implements MigrationInterface {
    name = 'ProjectExperienceDateRange1790867128811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experiences" DROP COLUMN "periodLabel"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "date"`);
        // Placeholder default for pre-existing rows — re-run the seed afterward to
        // set the real values (the free-text data this replaces can't be parsed in SQL).
        await queryRunner.query(`ALTER TABLE "experiences" ADD "startDate" date NOT NULL DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE "experiences" ALTER COLUMN "startDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "experiences" ADD "endDate" date`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "startDate" date NOT NULL DEFAULT CURRENT_DATE`);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "startDate" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "endDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "experiences" DROP COLUMN "endDate"`);
        await queryRunner.query(`ALTER TABLE "experiences" DROP COLUMN "startDate"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "date" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experiences" ADD "periodLabel" character varying NOT NULL`);
    }

}
