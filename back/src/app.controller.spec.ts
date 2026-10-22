import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('should report ok with a timestamp', () => {
      const result = appController.getHealth();
      expect(result.status).toBe('ok');
      expect(new Date(result.timestamp).toString()).not.toBe('Invalid Date');
    });
  });
});
