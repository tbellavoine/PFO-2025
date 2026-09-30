import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

/**
 * A single row is expected at launch (no open registration — see
 * docs/plan-dynamic-backend.md §4.4), but the table itself doesn't enforce
 * that, so it's ready to hold more if that's ever needed.
 */
@Entity({ name: 'admin_users' })
export class AdminUser extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  passwordHash!: string;
}
