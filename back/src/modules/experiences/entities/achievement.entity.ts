import { Column, Entity, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';
import { Experience } from './experience.entity.js';

@Entity({ name: 'achievements' })
export class Achievement extends BaseEntity {
  // Relation<T>, not a bare type: avoids a circular-import TDZ crash under
  // ESM (emitDecoratorMetadata needs a real reference; Experience/Achievement
  // import each other).
  @ManyToOne(() => Experience, (experience) => experience.achievements, { onDelete: 'CASCADE' })
  experience!: Relation<Experience>;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'int', default: 0 })
  order!: number;
}
