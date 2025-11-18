import { Module } from '@nestjs/common';
import { RoundRepository } from './round.repository';

@Module({
  providers: [RoundRepository],
  exports: [RoundRepository],
})
export class RoundModule {}

