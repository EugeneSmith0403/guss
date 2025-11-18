import { Module } from '@nestjs/common';
import { RoundsController } from './rounds.controller';
import { RoundsService } from './rounds.service';
import { RoundsRepository } from './repository/rounds.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RoundsController],
  providers: [RoundsService, RoundsRepository],
  exports: [RoundsService, RoundsRepository],
})
export class RoundsModule {}
