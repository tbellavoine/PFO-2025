import { Column, Entity } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';

// e.g. front_end/back_end/ux_ui/dev_ops/tools/quality — shared by the
// Skills page and each experience's skills breakdown.
@Entity({ name: 'skill_categories' })
export class SkillCategory extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  key!: string;

  @Column({ type: 'varchar' })
  label!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;
}
