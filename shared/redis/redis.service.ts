import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
  Scope,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable({ scope: Scope.TRANSIENT })
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private readonly defaultTtl = 3600;
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl =
      this.configService.get<string>('roundProcessor.redis.url') ||
      this.configService.getOrThrow<string>('backend.redis.url');
    this.client = new Redis(redisUrl);

    if (!process.env.REDIS_URL) {
      this.logger.warn(
        `REDIS_URL is not set. Falling back to default connection string "${redisUrl}".`,
      );
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }

  async increment(key: string, by: number = 1): Promise<number> {
    const value = await this.client.incrby(key, by);
    await this.client.expire(key, this.defaultTtl);
    return value;
  }

  async get(key: string): Promise<number> {
    const value = await this.client.get(key);
    return value ? parseInt(value, 10) : 0;
  }

  async getString(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: number | string): Promise<void> {
    await this.client.set(key, value.toString());
    await this.client.expire(key, this.defaultTtl);
  }

  async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  async deleteMany(keys: string[]): Promise<void> {
    if (!keys.length) {
      return;
    }
    await this.client.del(...keys);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
}

