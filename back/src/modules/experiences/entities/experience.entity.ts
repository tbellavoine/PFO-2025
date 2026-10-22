import { Column, Entity, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';
import { Achievement } from './achievement.entity.js';
import { ExperienceSkill } from './experience-skill.entity.js';
import { ExperienceStatus } from '../enums/experience-status.enum.js';

@Entity({ name: 'experiences' })
export class Experience extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  slug!: string;

  @Column({ type: 'varchar' })
  company!: string;

  @Column({ type: 'varchar' })
  role!: string;

  // Month+year granularity (day is always 1st). endDate null = ongoing.
  @Column({ type: 'date' })
  startDate!: string;

  @Column({ type: 'date', nullable: true })
  endDate!: string | null;

  @Column({ type: 'enum', enum: ExperienceStatus })
  status!: ExperienceStatus;

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
