import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactService } from './contact.service.js';
import { ContactInfo } from './entities/contact-info.entity.js';

@ApiTags('contact')
@Controller('v1/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  get(): Promise<ContactInfo> {
    return this.contactService.get();
  }
}
