import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@shared/db';
import { RedisModule } from '@shared/redis';
import { backendConfig } from './config/backend.config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoundsModule } from './rounds/rounds.module';
import { ScoresModule } from './scores/scores.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: false,
      isGlobal: true,
      ignoreEnvFile: true,
      load: [backendConfig],
    }),
    PrismaModule,
    RedisModule,
    UsersModule,
    AuthModule,
    RoundsModule,
    ScoresModule,
  ],
})
export class AppModule {}
