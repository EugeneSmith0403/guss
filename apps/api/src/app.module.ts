import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/db';
import { RedisModule } from '@shared/redis';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { RoundsModule } from './rounds/rounds.module';
import { ScoresModule } from './scores/scores.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    UsersModule,
    AuthModule,
    RoundsModule,
    ScoresModule,
  ],
})
export class AppModule {}
