import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity.js';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private readonly repository: Repository<Experience>,
  ) {}

  findAllPublished(): Promise<Experience[]> {
    return this.repository.find({
      where: { published: true },
      relations: { achievements: true, skills: { skill: true, category: true } },
      order: { order: 'ASC' },
    });
  }
}
