import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCookieAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { MediaService } from './media.service.js';
import { Media } from './entities/media.entity.js';

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

@ApiTags('admin/media')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/admin/media')
export class AdminMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  findAll(): Promise<Media[]> {
    return this.mediaService.findAll();
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: process.env.MEDIA_UPLOAD_DIR ?? './uploads',
        // A random filename, not the client-supplied one: avoids path
        // traversal and collisions, and the original name carries no
        // information the API or the admin UI need to keep.
        filename: (_req, file, callback) => {
          const ext = extname(file.originalname).toLowerCase();
          if (!ALLOWED_EXTENSIONS.has(ext)) {
            callback(new BadRequestException(`Unsupported file type: ${ext}`), '');
            return;
          }
          callback(null, `${randomUUID()}${ext}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('altText') altText?: string,
  ): Promise<Media> {
    if (!file) {
      throw new BadRequestException('No file uploaded (expected multipart field "file")');
    }
    return this.mediaService.save(file.filename, altText);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    await this.mediaService.remove(id);
  }
}
