import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service.js';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('v1/health')
  getHealth(): { status: 'ok'; timestamp: string } {
    return this.appService.getHealth();
  }
}
