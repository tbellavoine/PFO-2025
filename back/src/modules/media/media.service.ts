import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { Media } from './entities/media.entity.js';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly repository: Repository<Media>,
    private readonly config: ConfigService,
  ) {}

  findAll(): Promise<Media[]> {
    return this.repository.find({ order: { createdAt: 'DESC' } });
  }

  async save(filename: string, altText?: string): Promise<Media> {
    const publicUrl = `${this.config.get<string>('MEDIA_PUBLIC_URL')}/${filename}`;
    return this.repository.save(this.repository.create({ filename, url: publicUrl, altText }));
  }

  async remove(id: string): Promise<void> {
    const media = await this.repository.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media ${id} not found`);
    }
    const uploadDir = this.config.get<string>('MEDIA_UPLOAD_DIR') ?? './uploads';
    await unlink(join(uploadDir, media.filename)).catch(() => {
      // File already gone from disk — still remove the DB row below rather
      // than leaving a dangling reference the admin UI can't clean up.
    });
    await this.repository.delete(id);
  }
}
