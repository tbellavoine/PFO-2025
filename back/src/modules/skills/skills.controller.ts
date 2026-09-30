import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkillsService, SkillCategoryView } from './skills.service.js';

@ApiTags('skills')
@Controller('v1/skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll(): Promise<SkillCategoryView[]> {
    return this.skillsService.findAll();
  }
}
