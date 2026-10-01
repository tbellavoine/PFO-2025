import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';
import { Skill } from '#modules/skills/entities/skill.entity.js';
import { Media } from '#modules/media/entities/media.entity.js';
import { ProjectLink } from './project-link.entity.js';
import { Company } from '../enums/company.enum.js';
import { ProjectCategory } from '../enums/project-category.enum.js';
import { ProjectType } from '../enums/project-type.enum.js';
import { ProjectStatus } from '../enums/project-status.enum.js';

@Entity({ name: 'projects' })
export class Project extends BaseEntity {
  // Free text: not every project has a single clean year ("2020 - 2025").
  @Column({ type: 'varchar' })
  date!: string;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'enum', enum: Company })
  company!: Company;

  @Column({ type: 'enum', enum: ProjectCategory })
  category!: ProjectCategory;

  @Column({ type: 'enum', enum: ProjectType })
  type!: ProjectType;

  @Column({ type: 'enum', enum: ProjectStatus })
  status!: ProjectStatus;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ type: 'boolean', default: false })
  published!: boolean;

  @ManyToMany(() => Skill, { eager: true })
  @JoinTable({ name: 'project_skills' })
  skills!: Relation<Skill>[];

  @OneToMany(() => ProjectLink, (link) => link.project, { cascade: true })
  links!: Relation<ProjectLink>[];

  // Real FK to an uploaded image; `links` only holds external URLs.
  @ManyToOne(() => Media, { nullable: true, eager: true })
  @JoinColumn()
  previewImage?: Relation<Media>;
}
