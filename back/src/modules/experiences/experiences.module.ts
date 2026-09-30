import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity.js';
import { Achievement } from './entities/achievement.entity.js';
import { ExperienceSkill } from './entities/experience-skill.entity.js';
import { ExperiencesService } from './experiences.service.js';
import { ExperiencesController } from './experiences.controller.js';
import { SkillsModule } from '../skills/skills.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Experience, Achievement, ExperienceSkill]), SkillsModule],
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
  exports: [ExperiencesService],
})
export class ExperiencesModule {}
