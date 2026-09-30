import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity.js';
import { SkillCategory } from './entities/skill-category.entity.js';
import { SkillCategoryEntry } from './entities/skill-category-entry.entity.js';
import { SkillsService } from './skills.service.js';
import { SkillsController } from './skills.controller.js';
import { AdminSkillsController } from './admin-skills.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Skill, SkillCategory, SkillCategoryEntry])],
  controllers: [SkillsController, AdminSkillsController],
  providers: [SkillsService],
  exports: [SkillsService, TypeOrmModule],
})
export class SkillsModule {}
