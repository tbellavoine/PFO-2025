import { Column, Entity, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';
import { Project } from './project.entity.js';

@Entity({ name: 'project_links' })
export class ProjectLink extends BaseEntity {
  @ManyToOne(() => Project, (project) => project.links, { onDelete: 'CASCADE' })
  project!: Relation<Project>;

  @Column({ type: 'varchar' })
  label!: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;
}
