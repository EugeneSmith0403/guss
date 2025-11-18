import { Module } from '@nestjs/common';
import { ScoresController } from './scores.controller';
import { ScoresService } from './scores.service';
import { RoundsModule } from '../rounds/rounds.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RoundsModule, UsersModule, AuthModule],
  controllers: [ScoresController],
  providers: [ScoresService],
})
export class ScoresModule {}
