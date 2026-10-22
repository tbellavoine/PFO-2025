import { Column, Entity } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';

// One row expected (no open registration); table doesn't enforce it.
@Entity({ name: 'admin_users' })
export class AdminUser extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  passwordHash!: string;
}
