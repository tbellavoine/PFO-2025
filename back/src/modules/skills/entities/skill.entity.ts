import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

/**
 * The single skill catalog for the whole site. Replaces three parallel
 * representations that existed in the static front end: the `Skill` enum
 * (used to tag projects), the free-text arrays inside each experience's
 * `skills` object, and the keys of the six dictionaries in SkillsComponent.
 */
@Entity({ name: 'skills' })
export class Skill extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;
}
