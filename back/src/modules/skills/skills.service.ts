import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './entities/skill.entity.js';
import { SkillCategory } from './entities/skill-category.entity.js';
import { SkillCategoryEntry } from './entities/skill-category-entry.entity.js';
import { CreateSkillDto } from './dto/create-skill.dto.js';
import { UpsertSkillEntryDto } from './dto/upsert-skill-entry.dto.js';

export interface SkillCategoryView {
  key: string;
  label: string;
  skills: { name: string; level: string }[];
}

const SLUG = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
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

  // --- Admin: skill catalog ---

  findAllSkills(): Promise<Skill[]> {
    return this.skillRepository.find({ order: { name: 'ASC' } });
  }

  async createSkill(dto: CreateSkillDto): Promise<Skill> {
    return this.skillRepository.save(
      this.skillRepository.create({ name: dto.name, slug: SLUG(dto.name) }),
    );
  }

  async deleteSkill(id: string): Promise<void> {
    const skill = await this.skillRepository.findOne({ where: { id } });
    if (!skill) {
      throw new NotFoundException(`Skill ${id} not found`);
    }
    // Cascades to skill_category_entries / experience_skills / project_skills (FK ON DELETE CASCADE).
    await this.skillRepository.delete(id);
  }

  // --- Admin: category entries (the Skills page's content) ---

  async findAllCategories(): Promise<SkillCategory[]> {
    return this.categoryRepository.find({ order: { order: 'ASC' } });
  }

  async findEntriesForCategory(categoryId: string): Promise<SkillCategoryEntry[]> {
    await this.getCategoryOrThrow(categoryId);
    return this.entryRepository.find({
      where: { category: { id: categoryId } },
      order: { order: 'ASC' },
    });
  }

  async upsertEntry(categoryId: string, dto: UpsertSkillEntryDto): Promise<SkillCategoryEntry> {
    await this.getCategoryOrThrow(categoryId);
    const existing = await this.entryRepository.findOne({
      where: { category: { id: categoryId }, skill: { id: dto.skillId } },
    });
    const entry =
      existing ??
      this.entryRepository.create({
        category: { id: categoryId } as SkillCategory,
        skill: { id: dto.skillId } as Skill,
      });
    entry.level = dto.level;
    if (dto.order !== undefined) entry.order = dto.order;
    return this.entryRepository.save(entry);
  }

  async deleteEntry(categoryId: string, skillId: string): Promise<void> {
    const entry = await this.entryRepository.findOne({
      where: { category: { id: categoryId }, skill: { id: skillId } },
    });
    if (!entry) {
      throw new NotFoundException(`No entry for skill ${skillId} in category ${categoryId}`);
    }
    await this.entryRepository.delete(entry.id);
  }

  private async getCategoryOrThrow(categoryId: string): Promise<SkillCategory> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Skill category ${categoryId} not found`);
    }
    return category;
  }
}
