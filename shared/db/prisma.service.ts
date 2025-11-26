import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(readonly configService: ConfigService) {
    const databaseUrl =
      configService.get<string>('roundProcessor.database.url') ||
      configService.getOrThrow<string>('backend.database.url');
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });

    if (!process.env.DATABASE_URL) {
      this.logger.warn(
        `DATABASE_URL is not set. Falling back to default connection string "${databaseUrl}".`,
      );
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

