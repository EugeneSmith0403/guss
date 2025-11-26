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
  const result = config({ path: envPath });
  if (result.error) {
    console.warn(`[main.ts] Failed to load .env from ${envPath}:`, result.error);
  }
} else {
  console.warn(`[main.ts] .env file not found at: ${envPath}`);
}

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    await app.init();
    logger.log('Round processor started successfully');
  } catch (error) {
    logger.error('Failed to start round processor', error as Error);
    process.exit(1);
  }
}

bootstrap();

