import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import databaseConfig from './config/database.config.js';
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
import { SkillsModule } from './modules/skills/skills.module.js';
import { ProfileModule } from './modules/profile/profile.module.js';
import { ExperiencesModule } from './modules/experiences/experiences.module.js';
import { ProjectsModule } from './modules/projects/projects.module.js';
import { ContactModule } from './modules/contact/contact.module.js';
import { MediaModule } from './modules/media/media.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60_000, limit: 100 }],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('database.url'),
        ssl: config.get('database.ssl'),
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
        // Schema changes go through migrations, never synchronize (even in dev).
        synchronize: false,
        // A managed DB can take a moment to accept connections on cold start;
        // retry instead of crashing on the first attempt.
        retryAttempts: 10,
        retryDelay: 3000,
      }),
    }),
    SkillsModule,
    ProfileModule,
    ExperiencesModule,
    ProjectsModule,
    ContactModule,
    MediaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
