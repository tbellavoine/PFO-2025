import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactInfo } from './entities/contact-info.entity.js';
import { ContactService } from './contact.service.js';
import { ContactController } from './contact.controller.js';
import { AdminContactController } from './admin-contact.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([ContactInfo])],
  controllers: [ContactController, AdminContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
