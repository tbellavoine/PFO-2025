import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity.js';

/**
 * Upload endpoint (multer, local disk — decision §2.4) lands in phase 2
 * alongside auth, since only the admin can upload. For now this only
 * exposes the repository so ProjectsModule can resolve previewImage.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  exports: [TypeOrmModule],
})
export class MediaModule {}
