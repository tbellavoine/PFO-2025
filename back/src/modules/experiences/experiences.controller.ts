import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExperiencesService } from './experiences.service.js';
import { Experience } from './entities/experience.entity.js';

@ApiTags('experiences')
@Controller('v1/experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Get()
  findAll(): Promise<Experience[]> {
    return this.experiencesService.findAllPublished();
  }
}
