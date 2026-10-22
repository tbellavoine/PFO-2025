import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity.js';
import { MediaService } from './media.service.js';
import { AdminMediaController } from './admin-media.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [AdminMediaController],
  providers: [MediaService],
  exports: [TypeOrmModule, MediaService],
})
export class MediaModule {}
