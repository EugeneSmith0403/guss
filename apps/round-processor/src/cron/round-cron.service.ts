import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { RabbitService } from '../modules/rabbitmq/rabbitmq.service';
import { ROUND_COMPLETED_QUEUE } from '../modules/rabbitmq/rabbitmq.constants';
import {
  FinishedRound,
  RoundRepository,
} from '../modules/round/round.repository';

@Injectable()
export class RoundCronService implements OnModuleInit {
  private readonly logger = new Logger(RoundCronService.name);
  private readonly inFlightRounds = new Set<string>();

  constructor(
    private readonly roundRepository: RoundRepository,
    private readonly rabbitService: RabbitService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitService.assertQueue(ROUND_COMPLETED_QUEUE);
  }

  @Cron('*/10 * * * * *')
  async handleCron(): Promise<void> {
    this.logger.log('Handling cron for round completion');

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const finishedRounds =
      await this.roundRepository.findFinishedRounds(currentTimestamp);

    for (const round of finishedRounds) {
      if (this.inFlightRounds.has(round.id)) {
        continue;
      }

      await this.rabbitService.sendToQueue(ROUND_COMPLETED_QUEUE, {
        roundId: round.id,
        endedAt: new Date(round.end * 1000).toISOString(),
      });

      this.inFlightRounds.add(round.id);
      this.logger.log(`Dispatched round ${round.id} to completion queue`);
    }

    this.cleanupInFlightRounds(finishedRounds);
  }

  private cleanupInFlightRounds(finishedRounds: FinishedRound[]): void {
    const pendingRoundIds = new Set(finishedRounds.map((round) => round.id));

    for (const roundId of this.inFlightRounds) {
      if (!pendingRoundIds.has(roundId)) {
        this.inFlightRounds.delete(roundId);
      }
    }
  }
}

