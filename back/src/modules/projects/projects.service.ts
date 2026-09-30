import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from './entities/project.entity.js';
import { ProjectLink } from './entities/project-link.entity.js';
import { Skill } from '../skills/entities/skill.entity.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

const ADMIN_RELATIONS = { links: true, skills: true, previewImage: true } as const;

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly repository: Repository<Project>,
    @InjectRepository(ProjectLink)
    private readonly linkRepository: Repository<ProjectLink>,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  findAllPublished(): Promise<Project[]> {
    return this.repository.find({
      where: { published: true },
      relations: { links: true, skills: true, previewImage: true },
      order: { order: 'ASC' },
    });
  }

  async findOnePublished(id: string): Promise<Project> {
    const project = await this.repository.findOne({
      where: { id, published: true },
      relations: { links: true, skills: true, previewImage: true },
    });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }

  findAllForAdmin(): Promise<Project[]> {
    return this.repository.find({ relations: ADMIN_RELATIONS, order: { order: 'ASC' } });
  }

  async findOneForAdmin(id: string): Promise<Project> {
    const project = await this.repository.findOne({ where: { id }, relations: ADMIN_RELATIONS });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found`);
    }
    return project;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const skills = await this.resolveSkills(dto.skillIds);
    const project = await this.repository.save(
      this.repository.create({
        date: dto.date,
        name: dto.name,
        company: dto.company,
        category: dto.category,
        type: dto.type,
        status: dto.status,
        description: dto.description,
        order: dto.order ?? 0,
        published: dto.published ?? false,
        skills,
        previewImage: dto.previewImageId ? { id: dto.previewImageId } : undefined,
      }),
    );
    await this.replaceLinks(project.id, dto.links);
    return this.findOneForAdmin(project.id);
  }

  async update(id: string, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOneForAdmin(id);
    Object.assign(project, {
      date: dto.date ?? project.date,
      name: dto.name ?? project.name,
      company: dto.company ?? project.company,
      category: dto.category ?? project.category,
      type: dto.type ?? project.type,
      status: dto.status ?? project.status,
      description: dto.description ?? project.description,
      order: dto.order ?? project.order,
      published: dto.published ?? project.published,
    });
    if (dto.skillIds !== undefined) {
      project.skills = await this.resolveSkills(dto.skillIds);
    }
    if (dto.previewImageId !== undefined) {
      project.previewImage = { id: dto.previewImageId } as Project['previewImage'];
    }
    await this.repository.save(project);

    if (dto.links !== undefined) {
      await this.replaceLinks(id, dto.links);
    }
    return this.findOneForAdmin(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOneForAdmin(id);
    await this.repository.delete(id);
  }

  private async resolveSkills(skillIds: string[]): Promise<Skill[]> {
    if (skillIds.length === 0) return [];
    const skills = await this.skillRepository.find({ where: { id: In(skillIds) } });
    if (skills.length !== skillIds.length) {
      throw new NotFoundException('One or more skillIds do not exist');
    }
    return skills;
  }

  private async replaceLinks(
    projectId: string,
    links: { label: string; url: string }[],
  ): Promise<void> {
    await this.linkRepository.delete({ project: { id: projectId } });
    await this.linkRepository.save(
      links.map((link, order) =>
        this.linkRepository.create({ project: { id: projectId }, label: link.label, url: link.url, order }),
      ),
    );
  }
}
