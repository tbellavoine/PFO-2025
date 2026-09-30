import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

/**
 * A skill category, e.g. front_end / back_end / ux_ui / dev_ops / tools /
 * quality — the same six categories the Skills page and each experience's
 * skills breakdown already both use, now shared instead of duplicated.
 */
@Entity({ name: 'skill_categories' })
export class SkillCategory extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  key!: string;

  @Column({ type: 'varchar' })
  label!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;
}
