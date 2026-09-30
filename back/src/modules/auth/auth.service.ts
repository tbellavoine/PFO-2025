import { Injectable, Logger, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { AdminUser } from './entities/admin-user.entity.js';
import type { JwtPayload } from './jwt-payload.interface.js';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepository: Repository<AdminUser>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * No open registration (see docs/plan-dynamic-backend.md §4.4): the
   * single admin account is defined by ADMIN_EMAIL/ADMIN_PASSWORD_HASH in
   * the environment, not signed up through the API. This keeps the DB row
   * in sync with whatever those env vars currently say every time the app
   * starts, rather than requiring a separate one-off script to run first.
   */
  async onModuleInit(): Promise<void> {
    const email = this.config.get<string>('ADMIN_EMAIL');
    const passwordHash = this.config.get<string>('ADMIN_PASSWORD_HASH');
    if (!email || !passwordHash) {
      this.logger.warn('ADMIN_EMAIL / ADMIN_PASSWORD_HASH not set — no admin account provisioned yet.');
      return;
    }

    const existing = await this.adminRepository.findOne({ where: { email } });
    if (!existing) {
      await this.adminRepository.save(this.adminRepository.create({ email, passwordHash }));
      this.logger.log(`Admin account provisioned for ${email}`);
    } else if (existing.passwordHash !== passwordHash) {
      existing.passwordHash = passwordHash;
      await this.adminRepository.save(existing);
      this.logger.log(`Admin password hash updated for ${email} from environment`);
    }
  }

  async validateCredentials(email: string, password: string): Promise<AdminUser> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const valid = await argon2.verify(admin.passwordHash, password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return admin;
  }

  issueToken(admin: AdminUser): string {
    const payload: JwtPayload = { sub: admin.id, email: admin.email };
    return this.jwtService.sign(payload);
  }
}
