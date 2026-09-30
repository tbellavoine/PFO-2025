import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

/**
 * Singleton: exactly one row is expected to exist. Enforced at the service
 * layer (always read/update the first row), not by a DB constraint — the
 * only writer is the single admin account, so the extra constraint isn't
 * pulling its weight yet.
 */
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
