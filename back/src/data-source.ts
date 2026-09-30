import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Skill } from './modules/skills/entities/skill.entity.js';
import { SkillCategory } from './modules/skills/entities/skill-category.entity.js';
import { SkillCategoryEntry } from './modules/skills/entities/skill-category-entry.entity.js';
import { Profile } from './modules/profile/entities/profile.entity.js';
import { Experience } from './modules/experiences/entities/experience.entity.js';
import { Achievement } from './modules/experiences/entities/achievement.entity.js';
import { ExperienceSkill } from './modules/experiences/entities/experience-skill.entity.js';
import { Project } from './modules/projects/entities/project.entity.js';
import { ProjectLink } from './modules/projects/entities/project-link.entity.js';
import { Media } from './modules/media/entities/media.entity.js';
import { ContactInfo } from './modules/contact/entities/contact-info.entity.js';
import { AdminUser } from './modules/auth/entities/admin-user.entity.js';

/**
 * Used by the TypeORM CLI only (migration:generate/run/revert), via
 * `npm run typeorm -- <command>` (see package.json). The running Nest app
 * gets its own DataSource from TypeOrmModule.forRootAsync in app.module.ts;
 * both must list the same entities.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: [
    Skill,
    SkillCategory,
    SkillCategoryEntry,
    Profile,
    Experience,
    Achievement,
    ExperienceSkill,
    Project,
    ProjectLink,
    Media,
    ContactInfo,
    AdminUser,
  ],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
