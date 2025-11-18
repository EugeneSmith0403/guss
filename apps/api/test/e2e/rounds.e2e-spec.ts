import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('RoundsController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

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
      .send({ name: 'roundtestuser', password: 'roundtestpass' });

    authToken = authResponse.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/rounds (POST) - should create a new round', () => {
    return request(app.getHttpServer())
      .post('/rounds')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ duration: 60, cooldown: 30 })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
      });
  });

  it('/rounds (GET) - should get all rounds', () => {
    return request(app.getHttpServer())
      .get('/rounds')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/rounds/:id (GET) - should get a round by id', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/rounds')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ duration: 60, cooldown: 30 });

    const roundId = createResponse.body.id;

    return request(app.getHttpServer())
      .get(`/rounds/${roundId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', roundId);
        expect(res.body).toHaveProperty('status');
        expect(res.body).toHaveProperty('start');
        expect(res.body).toHaveProperty('end');
      });
  });

  it('/rounds (POST) - should require authentication', () => {
    return request(app.getHttpServer())
      .post('/rounds')
      .send({ duration: 60, cooldown: 30 })
      .expect(401);
  });

  it('/rounds (POST) - should validate input', () => {
    return request(app.getHttpServer())
      .post('/rounds')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ duration: 'invalid', cooldown: 30 })
      .expect(400);
  });
});

