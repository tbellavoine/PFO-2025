import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { SkillsService } from './skills.service.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpsertSkillEntryDto } from './dto/upsert-skill-entry.dto.js';
import { Skill } from './entities/skill.entity.js';
import { SkillCategory } from './entities/skill-category.entity.js';
import { SkillCategoryEntry } from './entities/skill-category-entry.entity.js';

@ApiTags('admin/skills')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/admin/skills')
export class AdminSkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAllSkills(): Promise<Skill[]> {
    return this.skillsService.findAllSkills();
  }

  @Post()
  createSkill(@Body() dto: CreateSkillDto): Promise<Skill> {
    return this.skillsService.createSkill(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteSkill(@Param('id') id: string): Promise<void> {
    await this.skillsService.deleteSkill(id);
  }

  @Get('categories')
  findAllCategories(): Promise<SkillCategory[]> {
    return this.skillsService.findAllCategories();
  }

  @Get('categories/:categoryId/entries')
  findEntries(@Param('categoryId') categoryId: string): Promise<SkillCategoryEntry[]> {
    return this.skillsService.findEntriesForCategory(categoryId);
  }

  @Put('categories/:categoryId/entries')
  upsertEntry(
    @Param('categoryId') categoryId: string,
    @Body() dto: UpsertSkillEntryDto,
  ): Promise<SkillCategoryEntry> {
    return this.skillsService.upsertEntry(categoryId, dto);
  }

  @Delete('categories/:categoryId/entries/:skillId')
  @HttpCode(204)
  async deleteEntry(
    @Param('categoryId') categoryId: string,
    @Param('skillId') skillId: string,
  ): Promise<void> {
    await this.skillsService.deleteEntry(categoryId, skillId);
  }
}
