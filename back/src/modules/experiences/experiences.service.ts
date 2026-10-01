import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from './entities/experience.entity.js';
import { Achievement } from './entities/achievement.entity.js';
import { ExperienceSkill } from './entities/experience-skill.entity.js';
import { CreateExperienceDto } from './dto/create-experience.dto.js';
import { UpdateExperienceDto } from './dto/update-experience.dto.js';

const ADMIN_RELATIONS = { achievements: true, skills: { skill: true, category: true } } as const;

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private readonly repository: Repository<Experience>,
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
    @InjectRepository(ExperienceSkill)
    private readonly experienceSkillRepository: Repository<ExperienceSkill>,
  ) {}

  findAllPublished(): Promise<Experience[]> {
    return this.repository.find({
      where: { published: true },
      relations: ADMIN_RELATIONS,
      order: { order: 'ASC' },
    });
  }

  findAllForAdmin(): Promise<Experience[]> {
    return this.repository.find({ relations: ADMIN_RELATIONS, order: { order: 'ASC' } });
  }

  async findOneForAdmin(id: string): Promise<Experience> {
    const experience = await this.repository.findOne({ where: { id }, relations: ADMIN_RELATIONS });
    if (!experience) {
      throw new NotFoundException(`Experience ${id} not found`);
    }
    return experience;
  }

  async create(dto: CreateExperienceDto): Promise<Experience> {
    const experience = await this.repository.save(
      this.repository.create({
        slug: dto.slug,
        company: dto.company,
        role: dto.role,
        periodLabel: dto.periodLabel,
        status: dto.status,
        order: dto.order ?? 0,
        published: dto.published ?? false,
      }),
    );
    await this.replaceAchievementsAndSkills(experience.id, dto.achievements, dto.skills);
    return this.findOneForAdmin(experience.id);
  }

  async update(id: string, dto: UpdateExperienceDto): Promise<Experience> {
    const experience = await this.findOneForAdmin(id);
    Object.assign(experience, {
      slug: dto.slug ?? experience.slug,
      company: dto.company ?? experience.company,
      role: dto.role ?? experience.role,
      periodLabel: dto.periodLabel ?? experience.periodLabel,
      status: dto.status ?? experience.status,
      order: dto.order ?? experience.order,
      published: dto.published ?? experience.published,
    });
    await this.repository.save(experience);

    if (dto.achievements !== undefined || dto.skills !== undefined) {
      await this.replaceAchievementsAndSkills(
        id,
        dto.achievements ?? experience.achievements.map((a) => a.text),
        dto.skills ?? experience.skills.map((s) => ({ skillId: s.skill.id, categoryId: s.category.id })),
      );
    }
    return this.findOneForAdmin(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOneForAdmin(id);
    await this.repository.delete(id);
  }

  // Replace-all, not diff/merge: simpler, can't drift from the submitted form.
  private async replaceAchievementsAndSkills(
    experienceId: string,
    achievements: string[],
    skills: { skillId: string; categoryId: string }[],
  ): Promise<void> {
    await this.achievementRepository.delete({ experience: { id: experienceId } });
    await this.experienceSkillRepository.delete({ experience: { id: experienceId } });

    await this.achievementRepository.save(
      achievements.map((text, order) =>
        this.achievementRepository.create({ experience: { id: experienceId }, text, order }),
      ),
    );
    await this.experienceSkillRepository.save(
      skills.map((s) =>
        this.experienceSkillRepository.create({
          experience: { id: experienceId },
          skill: { id: s.skillId },
          category: { id: s.categoryId },
        }),
      ),
    );
  }
}
