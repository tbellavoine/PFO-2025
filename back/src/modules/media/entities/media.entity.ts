import { Column, Entity } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity.js';

// Uploaded file (project preview images). `url` = MEDIA_PUBLIC_URL + filename,
// served from local disk, not an S3-compatible bucket.
@Entity({ name: 'media' })
export class Media extends BaseEntity {
  @Column({ type: 'varchar' })
  filename!: string;

  @Column({ type: 'varchar' })
  url!: string;

  @Column({ type: 'varchar', nullable: true })
  altText?: string;
}
