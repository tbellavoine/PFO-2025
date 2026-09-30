import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import type { Request } from 'express';
import type { JwtPayload } from '../jwt-payload.interface.js';

/**
 * The JWT lives in an httpOnly cookie (access_token), not a header — a
 * plain browser-session admin console, not an API-token client — so the
 * extractor reads req.cookies instead of passport-jwt's default
 * Authorization-header extractors.
 */
function fromCookie(request: Request): string | null {
  return request.cookies?.access_token ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: fromCookie,
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): JwtPayload {
    if (!payload?.sub || !payload?.email) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
