import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ExperiencesService } from './experiences.service.js';
import { CreateExperienceDto } from './dto/create-experience.dto.js';
import { UpdateExperienceDto } from './dto/update-experience.dto.js';
import { Experience } from './entities/experience.entity.js';

@ApiTags('admin/experiences')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/admin/experiences')
export class AdminExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  findAll(): Promise<Experience[]> {
    return this.experiencesService.findAllForAdmin();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Experience> {
    return this.experiencesService.findOneForAdmin(id);
  }

  @Post()
  create(@Body() dto: CreateExperienceDto): Promise<Experience> {
    return this.experiencesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateExperienceDto): Promise<Experience> {
    return this.experiencesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.experiencesService.remove(id);
  }
}
