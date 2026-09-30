import { Column, Entity, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';
import { Experience } from './experience.entity.js';

@Entity({ name: 'achievements' })
export class Achievement extends BaseEntity {
  // Relation<T> (not a bare Experience type annotation) avoids a runtime
  // circular-import TDZ crash under ESM: emitDecoratorMetadata makes
  // TypeScript emit a real reference to the annotated class for
  // reflection, and Experience/Achievement import each other.
  @ManyToOne(() => Experience, (experience) => experience.achievements, { onDelete: 'CASCADE' })
  experience!: Relation<Experience>;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;
}
