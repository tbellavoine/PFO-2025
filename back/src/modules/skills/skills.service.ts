import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillCategory } from './entities/skill-category.entity.js';
import { SkillCategoryEntry } from './entities/skill-category-entry.entity.js';

export interface SkillCategoryView {
  key: string;
  label: string;
  skills: { name: string; level: string }[];
}

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(SkillCategory)
    private readonly categoryRepository: Repository<SkillCategory>,
    @InjectRepository(SkillCategoryEntry)
    private readonly entryRepository: Repository<SkillCategoryEntry>,
  ) {}

  async findAll(): Promise<SkillCategoryView[]> {
    const categories = await this.categoryRepository.find({ order: { order: 'ASC' } });

    return Promise.all(
      categories.map(async (category) => {
        const entries = await this.entryRepository.find({
          where: { category: { id: category.id } },
          order: { order: 'ASC' },
        });

        return {
          key: category.key,
          label: category.label,
          skills: entries.map((entry) => ({ name: entry.skill.name, level: entry.level })),
        };
      }),
    );
  }
}
