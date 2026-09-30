import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity.js';

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
}
