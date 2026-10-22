import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { ContactService } from './contact.service.js';
import { UpdateContactDto } from './dto/update-contact.dto.js';
import { ContactInfo } from './entities/contact-info.entity.js';

@ApiTags('admin/contact')
@ApiCookieAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/admin/contact')
export class AdminContactController {
  constructor(private readonly contactService: ContactService) {}

  @Put()
  update(@Body() dto: UpdateContactDto): Promise<ContactInfo> {
    return this.contactService.update(dto);
  }
}
