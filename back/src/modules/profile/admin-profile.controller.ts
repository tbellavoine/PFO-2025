import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ProfileService } from './profile.service.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { Profile } from './entities/profile.entity.js';

@ApiTags('admin/profile')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/admin/profile')
export class AdminProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put()
  update(@Body() dto: UpdateProfileDto): Promise<Profile> {
    return this.profileService.update(dto);
  }
}
