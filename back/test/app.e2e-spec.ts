import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  it('/v1/health (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/v1/health').expect(200);
    expect(response.body.status).toBe('ok');
  });

  describe('auth', () => {
    // Deliberately doesn't assume a specific admin account is provisioned
    // (it depends on ADMIN_EMAIL/ADMIN_PASSWORD_HASH, unset in CI — see
    // ci-back.yml) — a wrong password 401s whether or not an account
    // with that email happens to exist, which is exactly the property
    // this asserts.
    it('rejects login with a wrong password', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email: 'admin@example.com', password: 'definitely-not-the-password' })
        .expect(401);
    });

    it('rejects an admin route without a session cookie', async () => {
      await request(app.getHttpServer()).get('/v1/auth/me').expect(401);
    });

    it('rejects a malformed login payload', async () => {
      await request(app.getHttpServer())
        .post('/v1/auth/login')
        .send({ email: 'not-an-email', password: '' })
        .expect(400);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
