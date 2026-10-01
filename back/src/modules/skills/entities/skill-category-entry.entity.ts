import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';
import { Skill } from './skill.entity.js';
import { SkillCategory } from './skill-category.entity.js';
import { SkillLevel } from './skill-level.enum.js';

// Skills page join entity: (skill, category) -> proficiency level.
// Separate from ExperienceSkill/Project.skills, which have no level.
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
