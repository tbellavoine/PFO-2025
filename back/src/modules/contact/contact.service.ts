import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactInfo } from './entities/contact-info.entity.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactInfo)
    private readonly repository: Repository<ContactInfo>,
  ) {}

  async get(): Promise<ContactInfo> {
    const info = await this.repository.find({ take: 1 });
    if (!info[0]) {
      throw new NotFoundException('Contact info not set yet');
    }
    return info[0];
  }

  async update(dto: UpdateContactDto): Promise<ContactInfo> {
    const existing = await this.repository.find({ take: 1 });
    const info = existing[0] ?? this.repository.create();
    Object.assign(info, dto);
    return this.repository.save(info);
  }
}
