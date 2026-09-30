import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1790798231060 implements MigrationInterface {
    name = 'InitialSchema1790798231060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "slug" character varying NOT NULL, CONSTRAINT "UQ_81f05095507fd84aa2769b4a522" UNIQUE ("name"), CONSTRAINT "UQ_55b7acbf80551e7fa2b5a33ed6c" UNIQUE ("slug"), CONSTRAINT "PK_0d3212120f4ecedf90864d7e298" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill_categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "key" character varying NOT NULL, "label" character varying NOT NULL, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_722ae7964897d127b21a533c682" UNIQUE ("key"), CONSTRAINT "PK_efce364bf7be7b92b7d7f948663" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."skill_category_entries_level_enum" AS ENUM('✓', '~', '✗')`);
        await queryRunner.query(`CREATE TABLE "skill_category_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "level" "public"."skill_category_entries_level_enum" NOT NULL, "order" integer NOT NULL DEFAULT '0', "skillId" uuid, "categoryId" uuid, CONSTRAINT "UQ_238c698b82fa8adc87a7195e7d6" UNIQUE ("skillId", "categoryId"), CONSTRAINT "PK_07ce1fe926c6d342366e85e7fdf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "title" character varying NOT NULL, "bioParagraphs" jsonb NOT NULL, "softSkills" jsonb NOT NULL, "cvUrl" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "achievements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "text" text NOT NULL, "order" integer NOT NULL DEFAULT '0', "experienceId" uuid, CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experience_skills" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "experienceId" uuid, "skillId" uuid, "categoryId" uuid, CONSTRAINT "UQ_292a0245d8ffbaabdaaba5fb741" UNIQUE ("experienceId", "skillId"), CONSTRAINT "PK_205b3a5c2e13627ccdc8ad33fdf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "experiences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "slug" character varying NOT NULL, "company" character varying NOT NULL, "role" character varying NOT NULL, "periodLabel" character varying NOT NULL, "status" character varying NOT NULL, "order" integer NOT NULL DEFAULT '0', "published" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_30f1738771b90de0864ac67116f" UNIQUE ("slug"), CONSTRAINT "PK_884f0913a63882712ea578e7c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "filename" character varying NOT NULL, "url" character varying NOT NULL, "altText" character varying, CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "label" character varying NOT NULL, "url" character varying NOT NULL, "order" integer NOT NULL DEFAULT '0', "projectId" uuid, CONSTRAINT "PK_afff993e1b62a47c2168aff2c56" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."projects_company_enum" AS ENUM('Adveris', 'Personnel', 'Web atrio')`);
        await queryRunner.query(`CREATE TYPE "public"."projects_category_enum" AS ENUM('Applications Web', 'Contenu & Média', 'Communauté & Social', 'E-commerce & Vente', 'Sites vitrine & Corporate')`);
        await queryRunner.query(`CREATE TYPE "public"."projects_type_enum" AS ENUM('Personel', 'Professionnel')`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('Terminé', 'En cours', 'Refondu')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "date" character varying NOT NULL, "name" character varying NOT NULL, "company" "public"."projects_company_enum" NOT NULL, "category" "public"."projects_category_enum" NOT NULL, "type" "public"."projects_type_enum" NOT NULL, "status" "public"."projects_status_enum" NOT NULL, "description" text NOT NULL, "order" integer NOT NULL DEFAULT '0', "published" boolean NOT NULL DEFAULT false, "previewImageId" uuid, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "contact_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "site" character varying NOT NULL, "email" character varying NOT NULL, "linkedin" character varying NOT NULL, CONSTRAINT "PK_65b98fa4ffb26dceb9192f5d496" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admin_users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "UQ_dcd0c8a4b10af9c986e510b9ecc" UNIQUE ("email"), CONSTRAINT "PK_06744d221bb6145dc61e5dc441d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_skills" ("projectsId" uuid NOT NULL, "skillsId" uuid NOT NULL, CONSTRAINT "PK_290e66c4385caec8f39d74e9419" PRIMARY KEY ("projectsId", "skillsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f7ce3e1474ca215003433d1118" ON "project_skills"  ("projectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_652ae37711df572b75465a520c" ON "project_skills"  ("skillsId") `);
        await queryRunner.query(`ALTER TABLE "skill_category_entries" ADD CONSTRAINT "FK_1f48236a95870cee54eda146cbf" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "skill_category_entries" ADD CONSTRAINT "FK_890ecab9d82e25bb2f1c772839e" FOREIGN KEY ("categoryId") REFERENCES "skill_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievements" ADD CONSTRAINT "FK_32903e7c8322154339100f3ef58" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_skills" ADD CONSTRAINT "FK_fa99fda757c5d7775f8559f0627" FOREIGN KEY ("experienceId") REFERENCES "experiences"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_skills" ADD CONSTRAINT "FK_f7a7dfa66dca37429e8c4e33359" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "experience_skills" ADD CONSTRAINT "FK_f490e252868f329e47f599a6567" FOREIGN KEY ("categoryId") REFERENCES "skill_categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_links" ADD CONSTRAINT "FK_b18dc8616c0cf11220d8fbf9021" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_2b37a3f62036f86d4c8ee09a67e" FOREIGN KEY ("previewImageId") REFERENCES "media"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_skills" ADD CONSTRAINT "FK_f7ce3e1474ca215003433d11181" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_skills" ADD CONSTRAINT "FK_652ae37711df572b75465a520c8" FOREIGN KEY ("skillsId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_skills" DROP CONSTRAINT "FK_652ae37711df572b75465a520c8"`);
        await queryRunner.query(`ALTER TABLE "project_skills" DROP CONSTRAINT "FK_f7ce3e1474ca215003433d11181"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2b37a3f62036f86d4c8ee09a67e"`);
        await queryRunner.query(`ALTER TABLE "project_links" DROP CONSTRAINT "FK_b18dc8616c0cf11220d8fbf9021"`);
        await queryRunner.query(`ALTER TABLE "experience_skills" DROP CONSTRAINT "FK_f490e252868f329e47f599a6567"`);
        await queryRunner.query(`ALTER TABLE "experience_skills" DROP CONSTRAINT "FK_f7a7dfa66dca37429e8c4e33359"`);
        await queryRunner.query(`ALTER TABLE "experience_skills" DROP CONSTRAINT "FK_fa99fda757c5d7775f8559f0627"`);
        await queryRunner.query(`ALTER TABLE "achievements" DROP CONSTRAINT "FK_32903e7c8322154339100f3ef58"`);
        await queryRunner.query(`ALTER TABLE "skill_category_entries" DROP CONSTRAINT "FK_890ecab9d82e25bb2f1c772839e"`);
        await queryRunner.query(`ALTER TABLE "skill_category_entries" DROP CONSTRAINT "FK_1f48236a95870cee54eda146cbf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_652ae37711df572b75465a520c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f7ce3e1474ca215003433d1118"`);
        await queryRunner.query(`DROP TABLE "project_skills"`);
        await queryRunner.query(`DROP TABLE "admin_users"`);
        await queryRunner.query(`DROP TABLE "contact_info"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."projects_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."projects_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."projects_company_enum"`);
        await queryRunner.query(`DROP TABLE "project_links"`);
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TABLE "experiences"`);
        await queryRunner.query(`DROP TABLE "experience_skills"`);
        await queryRunner.query(`DROP TABLE "achievements"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TABLE "skill_category_entries"`);
        await queryRunner.query(`DROP TYPE "public"."skill_category_entries_level_enum"`);
        await queryRunner.query(`DROP TABLE "skill_categories"`);
        await queryRunner.query(`DROP TABLE "skills"`);
    }

}
