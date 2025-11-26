import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '@shared/db';
import { RedisModule } from '@shared/redis';
import { roundProcessorConfig } from './config/round-processor.config';
import { RoundCronService } from './cron/round-cron.service';
import { RoundFinishedConsumer } from './consumers/round-finished.consumer';
import { RabbitModule } from './modules/rabbitmq/rabbitmq.module';
import { RoundModule } from './modules/round/round.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: false,
      isGlobal: true,
      ignoreEnvFile: true,
      load: [roundProcessorConfig],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    RoundModule,
    RabbitModule,
  ],
  providers: [RoundCronService, RoundFinishedConsumer],
})
export class AppModule {}

