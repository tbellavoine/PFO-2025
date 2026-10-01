import { Column, Entity } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';

// Singleton: one row expected, enforced at the service layer, not by DB constraint.
@Entity({ name: 'profile' })
export class Profile extends BaseEntity {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar' })
  title!: string;

  @Column({ type: 'jsonb' })
  bioParagraphs!: string[];

  @Column({ type: 'jsonb' })
  softSkills!: string[];

  @Column({ type: 'varchar', nullable: true })
  cvUrl?: string;
}
