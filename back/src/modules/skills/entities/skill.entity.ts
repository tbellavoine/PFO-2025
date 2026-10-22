import { Column, Entity } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';

// Single skill catalog, replacing the three separate representations the
// static front end used to have (project tags, experience text, skills page).
@Entity({ name: 'skills' })
export class Skill extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  slug!: string;
}
