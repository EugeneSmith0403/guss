import { config } from 'dotenv';
import { join } from 'path';
import { existsSync } from 'fs';

function findMonorepoRoot(): string {
  let currentDir = process.cwd();
  const maxDepth = 10;
  let depth = 0;
  
  while (depth < maxDepth) {
    if (existsSync(join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }
    const parentDir = join(currentDir, '..');
    if (parentDir === currentDir) break;
    currentDir = parentDir;
    depth++;
  }
  
  return process.cwd();
}

const rootDir = findMonorepoRoot();
const envPath = join(rootDir, '.env');
if (existsSync(envPath)) {
  const result = config({ path: envPath, override: true });
  if (result.error) {
    console.warn(`[main.ts] Failed to load .env from ${envPath}:`, result.error);
  }
} else {
  console.warn(`[main.ts] .env file not found at: ${envPath}`);
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUrl = configService.getOrThrow<string>('backend.api.frontendUrl');
  const apiPort = configService.getOrThrow<number>('backend.api.port');

  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('The Last of Guss API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(apiPort);
}
void bootstrap();
