import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from '@shared/redis';
import { UsersService } from '../users/users.service';
import { RoundsService } from '../rounds/rounds.service';
import type { ScoreResult } from './interfaces/score.interface';

@Injectable()
export class ScoresService {
  constructor(
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
    private readonly roundsService: RoundsService,
  ) {}

  private getUserScoreKey(roundId: string, userId: number): string {
    return `round:${roundId}:user:${userId}:scores`;
  }

  private getTotalScoreKey(roundId: string): string {
    return `round:${roundId}:totalScore`;
  }

  private getClickCounterKey(roundId: string, userId: number): string {
    return `round:${roundId}:user:${userId}:clicks`;
  }

  private async ensureRoundIsActive(roundId: string): Promise<void> {
    const round = await this.roundsService.findOne(roundId);

    if (!round) {
      throw new NotFoundException('Round not found');
    }

    if (round.status !== 'active') {
      throw new ConflictException('Round is not active');
    }
  }

  private getUserRole(userId: number): Promise<string | null> {
    return this.usersService
      .findById(userId)
      .then((user) => {
        if (!user) {
          throw new NotFoundException('User not found');
        }
        return user.roles.length > 0 ? user.roles[0].role : null;
      });
  }

  private async handleNikitaScore(
    roundId: string,
    userId: number,
  ): Promise<ScoreResult> {
    const userScoreKey = this.getUserScoreKey(roundId, userId);
    const totalScoreKey = this.getTotalScoreKey(roundId);

    await this.redisService.set(userScoreKey, 0);
    await this.redisService.increment(totalScoreKey, 0);

    return { score: 0 };
  }

  async incrementScore(
    roundId: string,
    userId: number,
  ): Promise<ScoreResult> {
    await this.ensureRoundIsActive(roundId);

    const userRole = await this.getUserRole(userId);
    if (userRole === 'nikita') {
      return this.handleNikitaScore(roundId, userId);
    }

    const clickCounterKey = this.getClickCounterKey(roundId, userId);
    const clicks = await this.redisService.increment(clickCounterKey);
    const increment = clicks % 11 === 0 ? 10 : 1;

    return this.applyScoreIncrement(roundId, userId, increment);
  }

  async batchIncrement(
    roundId: string,
    userId: number,
    increment: number,
  ): Promise<ScoreResult> {
    await this.ensureRoundIsActive(roundId);

    const userRole = await this.getUserRole(userId);
    if (userRole === 'nikita') {
      return this.handleNikitaScore(roundId, userId);
    }

    return this.applyScoreIncrement(roundId, userId, increment);
  }

  private async applyScoreIncrement(
    roundId: string,
    userId: number,
    increment: number,
  ): Promise<ScoreResult> {
    const userScoreKey = this.getUserScoreKey(roundId, userId);
    const totalScoreKey = this.getTotalScoreKey(roundId);

    const score = await this.redisService.increment(userScoreKey, increment);
    await this.redisService.increment(totalScoreKey, increment);

    return { score };
  }
}
