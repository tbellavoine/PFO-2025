import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly repository: Repository<Profile>,
  ) {}

  async get(): Promise<Profile> {
    const profile = await this.repository.find({ take: 1 });
    if (!profile[0]) {
      throw new NotFoundException('Profile not set yet');
    }
    return profile[0];
  }

  /** Singleton (§4.2 of the plan): creates the one row on first write, updates it after. */
  async update(dto: UpdateProfileDto): Promise<Profile> {
    const existing = await this.repository.find({ take: 1 });
    const profile = existing[0] ?? this.repository.create();
    Object.assign(profile, dto);
    return this.repository.save(profile);
  }
}
