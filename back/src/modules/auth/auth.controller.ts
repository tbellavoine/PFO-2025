import { Body, Controller, Get, HttpCode, Post, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentAdmin } from './decorators/current-admin.decorator.js';
import type { JwtPayload } from './jwt-payload.interface.js';

const COOKIE_NAME = 'access_token';

@ApiTags('auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  // Tighter than the app-wide default (100/min, see app.module.ts) — this
  // endpoint is the one worth slowing down against brute-forcing.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ email: string }> {
    const admin = await this.authService.validateCredentials(dto.email, dto.password);
    const token = this.authService.issueToken(admin);
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1h, matches JWT_EXPIRES_IN default
    });
    return { email: admin.email };
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response): { ok: true } {
    res.clearCookie(COOKIE_NAME);
    return { ok: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentAdmin() admin: JwtPayload): { email: string } {
    return { email: admin.email };
  }
}
