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

