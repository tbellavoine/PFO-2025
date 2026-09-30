import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity.js';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
  ) {}

  findAllPublished(): Promise<Project[]> {
    return this.repository.find({
      where: { published: true },
      relations: { links: true },
      order: { order: 'ASC' },
    });
  }

  async findOnePublished(id: string): Promise<Project> {
    const project = await this.repository.findOne({
      where: { id, published: true },
      relations: { links: true },
    });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }
}
