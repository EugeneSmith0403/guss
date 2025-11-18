import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('ScoresController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: number;
  let roundId: string;

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

    const authResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'scoretestuser', password: 'scoretestpass' });

    authToken = authResponse.body.token;
    userId = authResponse.body.user.id;

    const roundResponse = await request(app.getHttpServer())
      .post('/rounds')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ duration: 3600, cooldown: 1800 });

    roundId = roundResponse.body.id;

    await new Promise((resolve) => setTimeout(resolve, 1000));
  });

  afterAll(async () => {
    await app.close();
  });

  it('/scores/rounds/:roundId/users/:userId (POST) - should increment score', () => {
    return request(app.getHttpServer())
      .post(`/scores/rounds/${roundId}/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('score');
        expect(typeof res.body.score).toBe('number');
      });
  });

  it('/scores/rounds/:roundId/users/:userId/batch (POST) - should batch increment score', () => {
    return request(app.getHttpServer())
      .post(`/scores/rounds/${roundId}/users/${userId}/batch`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ increment: 10 })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('score');
        expect(typeof res.body.score).toBe('number');
      });
  });

  it('/scores/rounds/:roundId/users/:userId (POST) - should return 0 for nikita', async () => {
    const nikitaResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'nikita', password: 'nikita' });

    const nikitaToken = nikitaResponse.body.token;
    const nikitaUserId = nikitaResponse.body.user.id;

    const roundResponse = await request(app.getHttpServer())
      .post('/rounds')
      .set('Authorization', `Bearer ${nikitaToken}`)
      .send({ duration: 3600, cooldown: 1800 });

    const nikitaRoundId = roundResponse.body.id;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return request(app.getHttpServer())
      .post(`/scores/rounds/${nikitaRoundId}/users/${nikitaUserId}`)
      .set('Authorization', `Bearer ${nikitaToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.score).toBe(0);
      });
  });

  it('/scores/rounds/:roundId/users/:userId (POST) - should forbid access to other user data', async () => {
    const otherUserResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'otheruser', password: 'otherpass' });

    const otherUserId = otherUserResponse.body.user.id;

    return request(app.getHttpServer())
      .post(`/scores/rounds/${roundId}/users/${otherUserId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(403);
  });

  it('/scores/rounds/:roundId/users/:userId (POST) - should require authentication', () => {
    return request(app.getHttpServer())
      .post(`/scores/rounds/${roundId}/users/${userId}`)
      .expect(401);
  });

  it('/scores/rounds/:roundId/users/:userId (POST) - should fail if round is not active', async () => {
    const roundResponse = await request(app.getHttpServer())
      .post('/rounds')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ duration: 1, cooldown: 30 });

    const shortRoundId = roundResponse.body.id;

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return request(app.getHttpServer())
      .post(`/scores/rounds/${shortRoundId}/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(409);
  });
});

