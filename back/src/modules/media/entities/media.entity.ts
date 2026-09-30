import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity.js';

/**
 * An uploaded file (currently: project preview images). `url` is the
 * public path served by the API (MEDIA_PUBLIC_URL + filename) — decision
 * §2.4: local server disk, not an S3-compatible bucket, so `url` always
 * points back at this same API instance.
 */
@Entity({ name: 'media' })
export class Media extends BaseEntity {
  @Column({ type: 'varchar' })
  filename!: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'varchar', nullable: true })
  altText?: string;
}
