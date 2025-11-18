import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - should register new user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'testuser', password: 'testpass' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user).toHaveProperty('name', 'testuser');
      });
  });

  it('/auth/login (POST) - should login existing user', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'testuser2', password: 'testpass2' });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'testuser2', password: 'testpass2' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user.name).toBe('testuser2');
      });
  });

  it('/auth/login (POST) - should fail with invalid password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'testuser3', password: 'correctpass' });

    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'testuser3', password: 'wrongpass' })
      .expect(401);
  });

  it('/auth/login-or-register (POST) - should validate input', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: '', password: '' })
      .expect(400);
  });

  it('/auth/logout (POST) - should deactivate current token', async () => {
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ name: 'logoutuser', password: 'logoutpass' })
      .expect(201);

    const token = loginResponse.body.token;

    await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    await request(app.getHttpServer())
      .post('/rounds')
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});

