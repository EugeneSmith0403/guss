import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RedisService } from '@shared/redis';
import { ROUND_COMPLETED_QUEUE } from '../modules/rabbitmq/rabbitmq.constants';
import type { RoundCompletedMessage } from '../modules/rabbitmq/rabbitmq.constants';
import { RabbitService } from '../modules/rabbitmq/rabbitmq.service';
import {
  RoundRepository,
  RoundUserScore,
} from '../modules/round/round.repository';

@Injectable()
export class RoundFinishedConsumer implements OnModuleInit {
  private readonly logger = new Logger(RoundFinishedConsumer.name);

  private static getTotalScoreKey(roundId: string): string {
    return `round:${roundId}:totalScore`;
  }

  private static getUserScoreKeyPattern(roundId: string): string {
    return `round:${roundId}:user:*:scores`;
  }

  constructor(
    private readonly redisService: RedisService,
    private readonly roundRepository: RoundRepository,
    private readonly rabbitService: RabbitService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.rabbitService.assertQueue(ROUND_COMPLETED_QUEUE);
    await this.rabbitService.consume<RoundCompletedMessage>(
      ROUND_COMPLETED_QUEUE,
      async (message) => this.handleMessage(message),
    );
  }

  private async handleMessage({
    roundId,
  }: RoundCompletedMessage): Promise<void> {
    try {
      const totalScoreKey = RoundFinishedConsumer.getTotalScoreKey(roundId);
      const userScorePattern = RoundFinishedConsumer.getUserScoreKeyPattern(roundId);

      const totalScore = await this.redisService.get(totalScoreKey);
      const userScoreKeys = await this.redisService.keys(userScorePattern);

      const users = await this.collectUserScores(userScoreKeys, roundId);
      await this.roundRepository.upsertRoundUsers(roundId, users);

      const winner = this.findWinner(users);

      await this.roundRepository.completeRound(
        roundId,
        totalScore,
        winner?.userId,
      );

      await this.redisService.deleteMany([totalScoreKey, ...userScoreKeys]);

      this.logger.log(`Processed round ${roundId} completion event`);
    } catch (error) {
      this.logger.error(
        `Failed to process round ${roundId} completion`,
        error as Error,
      );
      throw error;
    }
  }

  private findWinner(users: RoundUserScore[]): RoundUserScore | undefined {
    if (users.length === 0) {
      return undefined;
    }

    return users.reduce((prev, current) =>
      current.score > prev.score ? current : prev,
    );
  }

  private async collectUserScores(
    keys: string[],
    roundId: string,
  ): Promise<RoundUserScore[]> {
    const users: RoundUserScore[] = [];

    for (const key of keys) {
      const userId = this.extractUserIdFromKey(key);
      if (userId === null) {
        this.logger.warn(
          `Skipping invalid Redis key "${key}" for round ${roundId}`,
        );
        continue;
      }

      const score = await this.redisService.get(key);
      users.push({ userId, score });
    }

    return users;
  }

  private extractUserIdFromKey(key: string): number | null {
    const match = key.match(/^round:[^:]+:user:(\d+):scores$/);
    return match ? Number(match[1]) : null;
  }
}

