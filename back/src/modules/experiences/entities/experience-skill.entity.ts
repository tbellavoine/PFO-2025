import { Entity, ManyToOne, Unique } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Experience } from './experience.entity.js';
import { Skill } from '../../skills/entities/skill.entity.js';
import { SkillCategory } from '../../skills/entities/skill-category.entity.js';

/**
 * A skill used in one experience, grouped by category (presence only — no
 * level, unlike SkillCategoryEntry on the Skills page).
 */
@Entity({ name: 'experience_skills' })
@Unique(['experience', 'skill'])
export class ExperienceSkill extends BaseEntity {
  @ManyToOne(() => Experience, (experience) => experience.skills, { onDelete: 'CASCADE' })
  experience!: Relation<Experience>;

  @ManyToOne(() => Skill, { eager: true, onDelete: 'CASCADE' })
  skill!: Relation<Skill>;

  @ManyToOne(() => SkillCategory, { eager: true, onDelete: 'CASCADE' })
  category!: Relation<SkillCategory>;
}
