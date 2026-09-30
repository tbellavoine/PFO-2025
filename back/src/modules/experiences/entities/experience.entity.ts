import { Column, Entity, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Achievement } from './achievement.entity.js';
import { ExperienceSkill } from './experience-skill.entity.js';

@Entity({ name: 'experiences' })
export class Experience extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'varchar' })
  company!: string;

  @Column({ type: 'varchar' })
  role!: string;

  /**
   * Free text, as in the current static data ("Oct 2020",
   * "Mai 2020 - Juin 2020") — not every entry has clean start/end dates.
   */
  @Column({ type: 'varchar' })
  periodLabel!: string;

  /** Free text too, e.g. "En cours" / "Terminée". */
  @Column({ type: 'varchar' })
  status!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ type: 'boolean', default: false })
  published!: boolean;

  @OneToMany(() => Achievement, (achievement) => achievement.experience, { cascade: true })
  achievements!: Relation<Achievement>[];

  @OneToMany(() => ExperienceSkill, (experienceSkill) => experienceSkill.experience, {
    cascade: true,
  })
  skills!: Relation<ExperienceSkill>[];
}
