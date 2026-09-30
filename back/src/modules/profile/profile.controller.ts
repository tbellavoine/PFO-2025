import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfileService } from './profile.service.js';
import { Profile } from './entities/profile.entity.js';

@ApiTags('profile')
@Controller('v1/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  get(): Promise<Profile> {
    return this.profileService.get();
  }
}
