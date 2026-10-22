import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service.js';
import { AdminUser } from './entities/admin-user.entity.js';

describe('AuthService', () => {
  let service: AuthService;
  let repository: { findOne: ReturnType<typeof vi.fn>; save: ReturnType<typeof vi.fn>; create: ReturnType<typeof vi.fn> };
  let config: { get: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    repository = {
      findOne: vi.fn(),
      save: vi.fn(),
      create: vi.fn((x) => x),
    };
    config = { get: vi.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(AdminUser), useValue: repository },
        { provide: JwtService, useValue: { sign: vi.fn(() => 'signed.jwt.token') } },
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe('validateCredentials', () => {
    it('rejects an unknown email', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.validateCredentials('nobody@example.com', 'x')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });

    it('rejects a wrong password', async () => {
      const hash = await argon2.hash('correct-password');
      repository.findOne.mockResolvedValue({ id: '1', email: 'admin@example.com', passwordHash: hash });
      await expect(
        service.validateCredentials('admin@example.com', 'wrong-password'),
      ).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('accepts the correct password', async () => {
      const hash = await argon2.hash('correct-password');
      const admin = { id: '1', email: 'admin@example.com', passwordHash: hash };
      repository.findOne.mockResolvedValue(admin);
      await expect(service.validateCredentials('admin@example.com', 'correct-password')).resolves.toBe(
        admin,
      );
    });
  });

  describe('issueToken', () => {
    it('signs a payload containing the admin id and email', () => {
      const admin = { id: '1', email: 'admin@example.com' } as AdminUser;
      const token = service.issueToken(admin);
      expect(token).toBe('signed.jwt.token');
    });
  });

  describe('onModuleInit', () => {
    it('does nothing when ADMIN_EMAIL/ADMIN_PASSWORD_HASH are not set', async () => {
      config.get.mockReturnValue(undefined);
      await service.onModuleInit();
      expect(repository.findOne).not.toHaveBeenCalled();
    });

    it('provisions the admin account on first run', async () => {
      config.get.mockImplementation((key: string) =>
        key === 'ADMIN_EMAIL' ? 'admin@example.com' : 'hash123',
      );
      repository.findOne.mockResolvedValue(null);
      await service.onModuleInit();
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'admin@example.com', passwordHash: 'hash123' }),
      );
    });

    it('updates the password hash if it drifted from the environment', async () => {
      config.get.mockImplementation((key: string) =>
        key === 'ADMIN_EMAIL' ? 'admin@example.com' : 'new-hash',
      );
      const existing = { id: '1', email: 'admin@example.com', passwordHash: 'old-hash' };
      repository.findOne.mockResolvedValue(existing);
      await service.onModuleInit();
      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ passwordHash: 'new-hash' }),
      );
    });
  });
});
