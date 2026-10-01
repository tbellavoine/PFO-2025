import { Column, Entity } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';

/** Singleton, same convention as Profile (§ enforced at the service layer). */
@Entity({ name: 'contact_info' })
export class ContactInfo extends BaseEntity {
  @Column({ type: 'varchar' })
  site!: string;

  @Column({ type: 'varchar' })
  email!: string;

  @Column({ type: 'varchar' })
  linkedin!: string;
}
