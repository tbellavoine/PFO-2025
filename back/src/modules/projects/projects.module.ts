import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity.js';
import { ProjectLink } from './entities/project-link.entity.js';
import { ProjectsService } from './projects.service.js';
import { ProjectsController } from './projects.controller.js';
import { SkillsModule } from '../skills/skills.module.js';
import { MediaModule } from '../media/media.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([Project, ProjectLink]), SkillsModule, MediaModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
