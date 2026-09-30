import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Skill } from './skill.entity.js';
import { SkillCategory } from './skill-category.entity.js';
import { SkillLevel } from './skill-level.enum.js';

/**
 * Join entity powering the Skills page: for a given (skill, category) pair,
 * the proficiency level shown there. Separate from ExperienceSkill and
 * Project.skills because "level" only makes sense in this one context —
 * an experience or a project just lists a skill as used, with no level.
 */
@Entity({ name: 'skill_category_entries' })
@Unique(['skill', 'category'])
export class SkillCategoryEntry extends BaseEntity {
  @ManyToOne(() => Skill, { eager: true, onDelete: 'CASCADE' })
  skill!: Relation<Skill>;

  @ManyToOne(() => SkillCategory, { eager: true, onDelete: 'CASCADE' })
  category!: Relation<SkillCategory>;

  @Column({ type: 'enum', enum: SkillLevel })
  level!: SkillLevel;

  @Column({ type: 'int', default: 0 })
  order!: number;
}
